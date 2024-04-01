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
const { dbDriver, loggerDriver, cacheDriver, createRootUserEvent } = dependencies;

(async () => {
  await dbDriver.connect();
  await cacheDriver.connect()

  await dbDriver.createIndex(usersSource, 'user_id')
  await dbDriver.createIndex(usersSource, 'email')
  await dbDriver.createIndex(memoSource, 'memo_id')

  createRootUserEvent.trigger({
    email: rootUserEmail,
    password: rootUserPassword,
  });
})();

if (environment === 'production' && cluster.isPrimary) {
  const numCPUs = availableParallelism();

  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  server.start(httpPort);
}

const gracefulShutdown = (signal: string, code: number) => {
  server.stop(async () => {
    await cacheDriver.del(rootUserEmail)

    await dbDriver.disconnect();
    await cacheDriver.disconnect();

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
  loggerDriver.fatal(`Application exited with code: ${code}`);
});
