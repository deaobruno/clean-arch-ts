import cluster from "node:cluster";
import process from "node:process";
import { availableParallelism } from "node:os";
import server from "./infra/http/v1/server";
import config from "./config";

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`[${process.pid}] Primary is running`);

  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  console.log(`[${process.pid}] Worker is running`);

  server.start(config.server.httpPort);
}

const gracefulShutdown = (signal: string, code: number) => {
  server.stop(() => {
    console.log("Shutting server down...");

    process.exit(code);
  });
};

process.on("uncaughtException", (error, origin) => {
  console.log(`[${origin}] ${error}`);
});

process.on("unhandledRejection", (error) => {
  console.log(`[unhandledRejection] ${error}`);
});

process.on("SIGINT", gracefulShutdown);

process.on("SIGTERM", gracefulShutdown);

process.on("exit", (code: number) => {
  console.log(`Server shut down with code: ${code}`);
});
