import { Server } from 'node:http'
import express, { NextFunction, Request, Response, Router } from 'express'
import bodyParser from 'body-parser'
import BaseRoute from '../http/BaseRoute'
import IServer from '../http/IServer'
import BaseMiddleware from '../../adapters/middlewares/BaseMiddleware'
import NotFoundError from '../../application/errors/NotFoundError'
import InternalServerError from '../../application/errors/InternalServerError'
import { error } from 'node:console'

export default class ExpressDriver implements IServer {
  app = express()

  httpServer?: Server

  router = Router()

  constructor(private _httpPort: string | number) {}

  start(routes: BaseRoute[], prefix?: string): void {
    this.app.use(bodyParser.json())

    this.app.use(bodyParser.urlencoded({ extended: false }))

    this.app.use(prefix ?? '', this._adaptRoutes(routes))

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new NotFoundError('Invalid URL'))
    })

    this.app.use(
      (
        error: Error & { statusCode: number },
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const { statusCode, message } = error

        if (!statusCode)
          error = new InternalServerError((!message || message === '') ? undefined : message)

        console.error(error.stack)

        res.status(error.statusCode).send({ error: error.message })
      }
    )

    this.httpServer = this.app.listen(this._httpPort, () => {
        console.log(`Server started. Listening on port ${this._httpPort}.`)
      }
    )
  }

  stop(callback?: (error?: Error) => void): void {
    this.httpServer?.close(callback)
  }

  private _adaptRoutes(routes: BaseRoute[]): Router[] {
    return routes.map(this._adaptRoute)
  }

  private _adaptRoute = (route: BaseRoute): Router => {
    let handlers = []

    route.middlewares?.forEach(middleware => handlers.push(this._adaptMiddleware(middleware)))

    handlers.push(this._adaptHandler(route))

    return this.router[route.method](route.path, handlers)
  }

  private _adaptMiddleware = (middleware: BaseMiddleware) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await middleware.handle(this._getPayload(req), req.headers)

        if (!result)
          return next()

        if (result instanceof Error)
          return next(error)

        const index = Object.keys(result)[0]

        req.body[index] = result[index]

        next()
      } catch (error) {
        next(error)
      }
    }

  private _adaptHandler = (route: BaseRoute) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        res
          .status(route.statusCode)
          .send(await route.handle(this._getPayload(req)))
      } catch (error) {
        next(error)
      }
    }

  private _getPayload(req: Request) {
    const { body, query, params } = req
    const reqData = [body, query, params].filter(
      (value) => Object.keys(value).length !== 0
    )
    const data = reqData.length > 1
      ? Object.assign(reqData[0], reqData[1], reqData[2])
      : reqData[0]

    return data ?? {}
  }
}
