import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const port = process.env.LH_PORT ?? "3000";
const baseUrl = process.env.LH_URL ?? `http://localhost:${port}`;
const tempRoot = join(root, ".lighthouse");
const chromeProfile = join(tempRoot, "chrome-profile");
const reportDir = join(root, "lighthouse-reports");

const useShell = process.platform === "win32";
const npmCmd = useShell ? "npm" : "npm";
const npxCmd = useShell ? "npx" : "npx";

const env = {
  ...process.env,
  TEMP: tempRoot,
  TMP: tempRoot,
};

function run(cmd, args, options = {}) {
  const { captureStderr = false, ...spawnOptions } = options;
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: captureStderr ? ["ignore", "inherit", "pipe"] : "inherit",
      shell: useShell,
      ...spawnOptions,
    });
    let stderr = "";
    if (captureStderr && child.stderr) {
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stderr });
      } else {
        const error = new Error(`${cmd} ${args.join(" ")} exited with ${code}`);
        error.stderr = stderr;
        reject(error);
      }
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function killProcessTree(pid) {
  if (!pid) return;
  if (process.platform === "win32") {
    try {
      await run("taskkill", ["/PID", String(pid), "/T", "/F"], {
        cwd: root,
        env,
        shell: useShell,
      });
    } catch {
      // ignore
    }
    return;
  }

  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // ignore
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const routes = [];
  let preset = "mobile";

  for (const arg of args) {
    if (arg.startsWith("--preset=")) {
      preset = arg.split("=")[1] || preset;
      continue;
    }
    if (arg.startsWith("--route=")) {
      routes.push(arg.split("=")[1]);
      continue;
    }
    if (arg.startsWith("--routes=")) {
      const list = arg.split("=")[1] || "";
      list.split(",").forEach((route) => {
        if (route) routes.push(route.trim());
      });
    }
  }

  if (routes.length === 0) {
    routes.push("/", "/github");
  }

  return { routes, preset };
}

function sanitizeRoute(route) {
  if (route === "/") return "home";
  return route
    .replace(/^\//, "")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function waitForServer(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return;
    } catch {
      // ignore
    }
    await sleep(1000);
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

async function main() {
  const { routes, preset } = parseArgs();
  if (!existsSync(join(root, ".next"))) {
    await run(npmCmd, ["run", "build"], { cwd: root, env });
  }

  mkdirSync(chromeProfile, { recursive: true });
  mkdirSync(reportDir, { recursive: true });

  let server = null;
  let serverExited = false;
  let startedServer = false;

  try {
    await waitForServer(baseUrl, 3000);
  } catch {
    server = spawn(npmCmd, ["run", "start", "--", "-p", port], {
      cwd: root,
      stdio: "inherit",
      shell: useShell,
      env,
    });
    startedServer = true;
    server.on("exit", () => {
      serverExited = true;
    });
    server.unref?.();
  }

  try {
    await waitForServer(baseUrl);
    if (serverExited) {
      throw new Error("Next.js server exited before Lighthouse started.");
    }

    for (const route of routes) {
      const routePath = route.startsWith("/") ? route : `/${route}`;
      const url = `${baseUrl}${routePath}`;
      const reportName = `lighthouse-${preset}-${sanitizeRoute(routePath)}.html`;
      const reportPath = join(reportDir, reportName);
      const lighthouseArgs = [
        "lighthouse",
        url,
        "--output=html",
        `--output-path=${reportPath}`,
        "--quiet",
        "--disable-full-page-screenshot",
        "--max-wait-for-load=45000",
      ];

      if (preset === "desktop") {
        lighthouseArgs.push("--preset=desktop");
      } else if (preset === "mobile") {
        lighthouseArgs.push("--form-factor=mobile");
      } else if (preset === "perf" || preset === "experimental") {
        lighthouseArgs.push(`--preset=${preset}`);
      }

      lighthouseArgs.push(
        `--chrome-flags=--headless=new --user-data-dir=${chromeProfile}`
      );

      try {
        await run(npxCmd, lighthouseArgs, {
          cwd: root,
          env,
          captureStderr: true,
        });
        console.log(`Lighthouse report written to ${reportPath}`);
      } catch (error) {
        const stderr = error?.stderr ?? "";
        const isCleanupError =
          stderr.includes("EPERM") && stderr.includes("lighthouse.");
        if (existsSync(reportPath) && isCleanupError) {
          console.warn(
            `Lighthouse finished but cleanup failed. Report still saved at ${reportPath}`
          );
        } else {
          throw error;
        }
      }
    }
  } finally {
    if (startedServer && !serverExited) {
      await killProcessTree(server?.pid);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
