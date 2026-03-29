import "dotenv/config";
import { getFirebaseAdminMessaging } from "@/lib/firebase-admin";
import mongoose from "mongoose";

type CheckResult = {
  label: string;
  ok: boolean;
  detail?: string;
};

function envFlag(value: string | undefined) {
  return value && value.trim().length > 0 ? "set" : "missing";
}

async function checkDatabase(): Promise<CheckResult[]> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.trim().length === 0) {
    return [
      {
        label: "MongoDB connection",
        ok: false,
        detail: "MONGODB_URI is missing"
      }
    ];
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB ?? "portfolio",
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });

    const db = mongoose.connection.db;
    if (!db) {
      return [
        {
          label: "MongoDB connection",
          ok: false,
          detail: "No database handle after connect"
        }
      ];
    }

    const [emailCount, pushCount] = await Promise.all([
      db.collection("notificationsubscribers").countDocuments(),
      db.collection("pushsubscribers").countDocuments()
    ]);

    return [
      { label: "MongoDB connection", ok: true, detail: "connected" },
      { label: "Email subscribers", ok: true, detail: String(emailCount) },
      { label: "Push tokens", ok: true, detail: String(pushCount) }
    ];
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return [
      {
        label: "MongoDB connection",
        ok: false,
        detail: message
      }
    ];
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

function checkFirebase(): CheckResult {
  try {
    getFirebaseAdminMessaging();
    return { label: "Firebase admin messaging", ok: true, detail: "initialized" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { label: "Firebase admin messaging", ok: false, detail: message };
  }
}

async function run() {
  const envChecks: CheckResult[] = [
    { label: "MONGODB_URI", ok: envFlag(process.env.MONGODB_URI) === "set" },
    { label: "NEXT_PUBLIC_APP_URL (prod)", ok: envFlag(process.env.NEXT_PUBLIC_APP_URL) === "set" },
    {
      label: "NEXT_PUBLIC_APP_URL_DEV (dev)",
      ok: envFlag(process.env.NEXT_PUBLIC_APP_URL_DEV) === "set" || process.env.NODE_ENV !== "development"
    },
    { label: "GMAIL_EMAIL", ok: envFlag(process.env.GMAIL_EMAIL) === "set" },
    { label: "GMAIL_APP_PASSWORD", ok: envFlag(process.env.GMAIL_APP_PASSWORD) === "set" },
    {
      label: "FIREBASE_SERVICE_ACCOUNT",
      ok: envFlag(process.env.FIREBASE_SERVICE_ACCOUNT) === "set"
    },
    { label: "FIREBASE_PROJECT_ID", ok: envFlag(process.env.FIREBASE_PROJECT_ID) === "set" },
    { label: "FIREBASE_CLIENT_EMAIL", ok: envFlag(process.env.FIREBASE_CLIENT_EMAIL) === "set" },
    { label: "FIREBASE_PRIVATE_KEY", ok: envFlag(process.env.FIREBASE_PRIVATE_KEY) === "set" }
  ];

  const dbChecks = await checkDatabase();
  const firebaseCheck = checkFirebase();

  const allChecks = [...envChecks, ...dbChecks, firebaseCheck];

  console.log("\nNotification system diagnostics\n");
  for (const check of allChecks) {
    const status = check.ok ? "OK" : "FAIL";
    const detail = check.detail ? ` - ${check.detail}` : "";
    console.log(`${status} ${check.label}${detail}`);
  }
  console.log("");
}

run().catch((error) => {
  console.error("Diagnostics failed", error);
  process.exitCode = 1;
});
