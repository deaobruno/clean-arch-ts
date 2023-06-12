import express, { NextFunction, Request, Response, Router } from 'express'
import Route from '../http/api/v1/routes/Route'
import Server from '../http/Server'
import { Server as HttpServer } from 'http'
import routes from '../http/api/v1/routes/routes'
import bodyParser from 'body-parser'
import NotFoundError from '../../application/errors/NotFoundError'
import InternalServerError from '../../application/errors/InternalServerError'
import Controller from '../../adapters/controllers/Controller'
import Presenter from '../../adapters/presenters/Presenter'
import Middleware from '../../adapters/middlewares/Middleware'

export default class ExpressDriver implements Server {
  app = express()

  httpServer?: HttpServer

  router = Router()

  httpPort = 8080

  start(): void {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use('/api/v1', <any>routes(this))

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
        console.error(error.stack)

        if (!error.statusCode)
          error = new InternalServerError(error.message) // eslint-disable-line no-param-reassign

        const { statusCode, message } = error

        res.status(statusCode).send({ error: message })
      }
    )

    this.httpServer = this.app.listen(this.httpPort, () => {
        console.log(`Server started. Listening on port ${this.httpPort}.`)
      }
    )
  }

  stop(callback?: (error?: Error) => void): void {
    this.httpServer?.close(callback)
  }

  route(method: string, path: string, statusCode: number, controller: Controller, presenter?: Presenter, middlewares?: Middleware[]): Router {
    let handlers = []
    const route = new Route(method.toLowerCase(), path, statusCode, controller, presenter)

    middlewares?.forEach(middleware => handlers.push(this.adaptMiddleware(middleware)))

    handlers.push(this.adaptRoute(route))

    return this.router[route.method](route.path, handlers)
  }

  getPayload(req: Request) {
    const { body, query, params } = req
    const reqData = [body, query, params].filter(
      (value) => Object.keys(value).length !== 0
    )
    const data = reqData.length > 1
      ? [Object.assign(reqData[0], reqData[1], reqData[2])]
      : reqData

    return data[0] ?? {}
  }

  adaptMiddleware = (middleware: Middleware) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await middleware.handle(this.getPayload(req))

        next()
      } catch (error) {
        next(error)
      }
    }

  adaptRoute = (route: Route) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        res
          .status(route.statusCode)
          .send(await route.route(this.getPayload(req)))
      } catch (error) {
        next(error)
      }
    }
}
