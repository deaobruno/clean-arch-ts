import { Server } from 'node:http';
import express, {
  NextFunction,
  Request,
  Response,
  Router,
  json,
  urlencoded,
} from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import sanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import IServerDriver from './IServerDriver';
import NotFoundError from '../../../application/errors/NotFoundError';
import InternalServerError from '../../../application/errors/InternalServerError';
import BaseController from '../../../adapters/controllers/BaseController';
import ILoggerDriver from '../logger/ILoggerDriver';
import IHashDriver from '../hash/IHashDriver';

export default class ExpressDriver implements IServerDriver {
  app = express();
  httpServer?: Server;
  router = Router();

  constructor(
    private loggerDriver: ILoggerDriver,
    hashDriver: IHashDriver,
    corsOpts: CorsOptions,
  ) {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.headers.start = new Date().toISOString();

      next();
    });
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const requestId = hashDriver.generateID();

      req.headers['request-id'] = requestId;
      res.setHeader('request-id', requestId);

      next();
    });
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const send = res.send;

      res.send = (content) => send.call(res, content);

      next();
    });
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(sanitize());
    this.app.use(xss());
    this.app.use(helmet());
    this.app.use(cors(corsOpts));
    this.app.use(this.router);
    this.app.use((req: Request, res: Response, next: NextFunction) =>
      next(new NotFoundError('Invalid URL')),
    );
    this.app.use(
      (
        error: Error & { statusCode: number },
        req: Request,
        res: Response,
        next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
      ): void => {
        const { statusCode, message } = error;
        const requestId = req.headers['request-id'];
        const duration = `${Date.now() - new Date(<string>req.headers.start).getTime()}ms`;

        if (!statusCode)
          error = new InternalServerError(
            !message || message === '' ? undefined : message,
          );

        this.loggerDriver.warn({
          method: req.method.toLowerCase(),
          path: req.url,
          statusCode,
          requestId,
          duration,
          message,
        });

        res.status(error.statusCode).send({ error: error.message });
      },
    );
  }

  get = (path: string, controller: BaseController): void => {
    this.router.get(path, this.adaptHandler(controller));
  };

  post = (path: string, controller: BaseController): void => {
    this.router.post(path, this.adaptHandler(controller));
  };

  put = (path: string, controller: BaseController): void => {
    this.router.put(path, this.adaptHandler(controller));
  };

  delete = (path: string, controller: BaseController): void => {
    this.router.delete(path, this.adaptHandler(controller));
  };

  start(httpPort: string | number): void {
    this.httpServer = this.app.listen(httpPort, () => {
      const serverAddress = this.httpServer?.address();
      let address = 'localhost';

      if (
        serverAddress &&
        typeof serverAddress === 'object' &&
        serverAddress.address !== '::'
      )
        address = serverAddress.address;

      this.loggerDriver.info(
        `[ExpressDriver] HTTP Server started: http://${address}:${httpPort}.`,
      );

      this.httpServer
        ?.on('close', () =>
          this.loggerDriver.fatal('[ExpressDriver] HTTP Server stopped'),
        )
        .on('error', (error) => this.loggerDriver.fatal(error));
    });
  }

  stop(callback?: (error?: Error) => void): void {
    this.httpServer?.close(callback);
  }

  private adaptHandler =
    (controller: BaseController) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { statusCode } = controller;
        const payload = { ...req.body, ...req.query, ...req.params };
        const result = await controller.handle(req.headers, payload);

        if (result instanceof Error) return next(result);

        res.on('finish', () => {
          if (statusCode >= 200 && statusCode < 300) {
            const info = {
              method: req.method.toLowerCase(),
              path: req.url,
              statusCode,
              requestId: req.headers['request-id'],
              duration: `${Date.now() - new Date(<string>req.headers.start).getTime()}ms`,
              headers: req.headers,
              payload,
            };

            if (req.body.user) info['userId'] = req.body.user.userId;

            this.loggerDriver.info(info);
          }
        });

        res.status(statusCode).send(result);
      } catch (error) {
        next(error);
      }
    };
}
