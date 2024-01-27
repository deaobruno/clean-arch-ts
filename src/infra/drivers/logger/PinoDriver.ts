import pino from "pino";
import ILoggerDriver from "./ILoggerDriver";

export default class PinoDriver implements ILoggerDriver {
  private _logger = pino({
    transport: {
      targets: [
        {
          target: "pino-pretty",
        },
        {
          target: "pino/file",
          level: "info",
          options: {
            destination: "./logs/info.log",
          },
        },
        {
          target: "pino/file",
          level: "error",
          options: {
            destination: "./logs/error.log",
          },
        },
      ],
    },
  });

  info(params: any): void {
    this._logger.info(params);
  }

  error(params: any): void {
    this._logger.error(params);
  }

  fatal(params: any): void {
    this._logger.fatal(params);
  }
}
