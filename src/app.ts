import cluster from "node:cluster";
import process from "node:process";
import { availableParallelism } from "node:os";
import server from "./infra/http/v1/server";
import config from "./config";
import dependencies from "./dependencies";

const {
  db: {
    usersSource,
    memoSource
  },
  app: { environment, rootUserEmail, rootUserPassword },
  server: { httpPort },
} = config;
const { dbDriver, loggerDriver, createRootUserEvent } = dependencies;
const numCPUs = availableParallelism();

(async () => {
  await dbDriver.createIndex(usersSource, 'user_id')
  await dbDriver.createIndex(usersSource, 'email')
  await dbDriver.createIndex(memoSource, 'memo_id')

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
