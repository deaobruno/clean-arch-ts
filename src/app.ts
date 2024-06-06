import cluster from 'node:cluster';
import process from 'node:process';
import { availableParallelism } from 'node:os';
import dependencies from './dependencies';
import routes from './routes/routes';

const { loggerDriver, startAppUseCase, stopAppUseCase } = dependencies;

(async () => {
  await startAppUseCase.exec({
    cluster,
    numCPUs: availableParallelism(),
    dependencies,
    routes,
  });
})();

const gracefulShutdown = async (signal: string, code: number) => {
  await stopAppUseCase.exec();

  process.exit(code);
};

process.on('uncaughtException', (error, origin) => {
  loggerDriver.error(`[${origin}] ${error}`);
});

process.on('unhandledRejection', (error) => {
  loggerDriver.error(`[unhandledRejection] ${error}`);
});

process.on('SIGINT', gracefulShutdown);

process.on('SIGTERM', gracefulShutdown);

process.on('exit', (code: number) => {
  loggerDriver.fatal(`Application exited with code: ${code}`);
});
