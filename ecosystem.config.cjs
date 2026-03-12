module.exports = {
  apps: [
    {
      name: "portfolio-web",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "portfolio-worker",
      script: "node_modules/.bin/tsx",
      args: "workers/startWorkers.ts",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
