import { Server } from "node:http";
import express, { NextFunction, Request, Response, Router } from "express";
import bodyParser from "body-parser";
import IServerDriver from "./IServerDriver";
import NotFoundError from "../../../application/errors/NotFoundError";
import InternalServerError from "../../../application/errors/InternalServerError";
import BaseController from "../../../adapters/controllers/BaseController";

export default class ExpressDriver implements IServerDriver {
  app = express();
  httpServer?: Server;
  router = Router();

  constructor() {}

  get = (path: string, controller: BaseController): Router => {
    return this.router.get(path, this._adaptHandler(controller));
  };

  post = (path: string, controller: BaseController): Router => {
    return this.router.post(path, this._adaptHandler(controller));
  };

  put = (path: string, controller: BaseController): Router => {
    return this.router.put(path, this._adaptHandler(controller));
  };

  delete = (path: string, controller: BaseController): Router => {
    return this.router.delete(path, this._adaptHandler(controller));
  };

  config(routes: Router[]): void {
    this.app.use(bodyParser.json());

    this.app.use(bodyParser.urlencoded({ extended: false }));

    routes.forEach((route) => this.app.use(route));

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new NotFoundError("Invalid URL"));
    });

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

        console.error(error.stack);

        res.status(error.statusCode).send({ error: error.message });
      }
    );
  }

  start(httpPort: string | number): void {
    this.httpServer = this.app.listen(httpPort, () => {
      console.log(
        `Express HTTP Server started. Listening on port ${httpPort}.`
      );
    });
  }

  stop(callback?: (error?: Error) => void): void {
    this.httpServer?.close(callback);
  }

  private _adaptHandler =
    (controller: BaseController) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await controller.handle(
          req.headers,
          this._getPayload(req)
        );

        if (result instanceof Error) return next(result);

        res.status(controller.statusCode).send(result);
      } catch (error) {
        next(error);
      }
    };

  private _getPayload(req: Request) {
    const { body, query, params } = req;
    const reqData = [body, query, params].filter(
      (value) => Object.keys(value).length !== 0
    );
    const data =
      reqData.length > 1
        ? Object.assign(reqData[0], reqData[1], reqData[2])
        : reqData[0];

    return data ?? {};
  }
}
