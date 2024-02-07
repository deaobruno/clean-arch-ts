import cluster from "node:cluster";
import process from "node:process";
import { availableParallelism } from "node:os";
import server from "./infra/http/v1/server";
import config from "./config";
import dependencies from "./dependencies";

const {
  db: {
    mongo: { dbUrl },
  },
  app: { environment, rootUserEmail, rootUserPassword },
  server: { httpPort },
} = config;
const { dbDriver, loggerDriver, createRootUserEvent } = dependencies;
const numCPUs = availableParallelism();

(async () => {
  await dbDriver.connect(dbUrl);

  createRootUserEvent.trigger({
    email: rootUserEmail,
    password: rootUserPassword,
  });
})();

if (environment === 'production' && cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  server.start(httpPort);
}

const gracefulShutdown = (signal: string, code: number) => {
  server.stop(async () => {
    loggerDriver.info("Shutting server down...");

    await dbDriver.disconnect();

    process.exit(code);
  });
};

process.on("uncaughtException", (error, origin) => {
  loggerDriver.error(`[${origin}] ${error}`);
});

process.on("unhandledRejection", (error) => {
  loggerDriver.error(`[unhandledRejection] ${error}`);
});

process.on("SIGINT", gracefulShutdown);

process.on("SIGTERM", gracefulShutdown);

process.on("exit", (code: number) => {
  loggerDriver.fatal(`Server shut down with code: ${code}`);
});
