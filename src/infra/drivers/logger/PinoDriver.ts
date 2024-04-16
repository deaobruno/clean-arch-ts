import pino, { Logger } from 'pino';
import ILoggerDriver from './ILoggerDriver';

export default class PinoDriver implements ILoggerDriver {
  private _logger: Logger;

  constructor(
    private infoLogPath: string,
    private errorLogPath: string,
  ) {
    this._logger = pino({
      transport: {
        targets: [
          {
            target: 'pino-pretty',
          },
          {
            target: 'pino/file',
            level: 'info',
            options: {
              destination: this.infoLogPath,
            },
          },
          {
            target: 'pino/file',
            level: 'error',
            options: {
              destination: this.errorLogPath,
            },
          },
        ],
      },
    });
  }

  info(params: unknown): void {
    this._logger.info(params);
  }

  error(params: unknown): void {
    this._logger.error(params);
  }

  fatal(params: unknown): void {
    this._logger.fatal(params);
  }
}
