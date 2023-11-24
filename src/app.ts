import cluster from "node:cluster";
import process from "node:process";
import { availableParallelism } from "node:os";
import server from "./infra/http/v1/server";
import config from "./config";
import dependencies from "./dependencies";

const { loggerDriver } = dependencies;
const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  server.start(config.server.httpPort);
}

const gracefulShutdown = (signal: string, code: number) => {
  server.stop(() => {
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
