import { Server } from "node:http";
import express, { NextFunction, Request, Response, Router, json, urlencoded } from "express";
import cors, { CorsOptions } from 'cors'
import helmet from "helmet";
import IServerDriver from "./IServerDriver";
import NotFoundError from "../../../application/errors/NotFoundError";
import InternalServerError from "../../../application/errors/InternalServerError";
import BaseController from "../../../adapters/controllers/BaseController";
import ILoggerDriver from "../logger/ILoggerDriver";

export default class ExpressDriver implements IServerDriver {
  app = express();
  httpServer?: Server;
  router = Router();

  constructor(private _logger: ILoggerDriver, corsOpts: CorsOptions) {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const send = res.send;

      res.send = (content) => send.call(res, content);

      res.on("finish", () => {
        this._logger.info({
          method: req.method.toLowerCase(),
          url: req.url,
          statusCode: res.statusCode.toString(),
          dateTime: new Date().toISOString(),
        });
      });

      next();
    });
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(cors(corsOpts));
    this.app.use(this.router);
    this.app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError("Invalid URL")));
    this.app.use(
      (
        error: Error & { statusCode: number },
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const { statusCode, message } = error;

        if (!statusCode)
          error = new InternalServerError(
            !message || message === "" ? undefined : message
          );

        this._logger.error(error.stack);

        res.status(error.statusCode).send({ error: error.message });
      }
    );
  }

  get = (path: string, controller: BaseController): void => {
    this.router.get(path, this._adaptHandler(controller));
  };

  post = (path: string, controller: BaseController): void => {
    this.router.post(path, this._adaptHandler(controller));
  };

  put = (path: string, controller: BaseController): void => {
    this.router.put(path, this._adaptHandler(controller));
  };

  delete = (path: string, controller: BaseController): void => {
    this.router.delete(path, this._adaptHandler(controller));
  };

  start(httpPort: string | number): void {
    this.httpServer = this.app.listen(httpPort, () => {
      const serverAddress = this.httpServer?.address()
      let address = 'localhost'

      if (serverAddress && typeof serverAddress === 'object' && serverAddress.address !== '::')
        address = serverAddress.address

      this._logger.info(
        `[Express] HTTP Server started: http://${address}:${httpPort}.`
      );

      this.httpServer?.on('close', () => this._logger.info('[Express] HTTP Server stopped'))
    });
  }

  stop(callback?: (error?: Error) => void): void {
    this.httpServer?.close(callback);
  }

  private _adaptHandler =
    (controller: BaseController) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const payload = { ...req.body, ...req.query, ...req.params };
        const result = await controller.handle(req.headers, payload);

        if (result instanceof Error) return next(result);

        res.status(controller.statusCode).send(result);
      } catch (error) {
        next(error);
      }
    };
}
