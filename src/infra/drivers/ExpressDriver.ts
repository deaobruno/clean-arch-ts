import express, { NextFunction, Request, Response, Router } from 'express'
import Route from '../http/Route'
import Server from '../http/Server'
import { Server as HttpServer } from 'http'
import routes from '../http/api/v1/routes/routes'
import bodyParser from 'body-parser'
import NotFoundError from '../../application/errors/NotFoundError'
import InternalServerError from '../../application/errors/InternalServerError'
import Controller from '../../adapters/controllers/Controller'
import Presenter from '../../adapters/presenters/Presenter'

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

  route(method: string, path: string, controller: Controller, presenter?: Presenter): Router {
    const route = new Route(method.toLowerCase(), path, controller, presenter)

    return this.router[route.method](route.path, this.adaptRoute(route))
  }

  adaptRoute = (route: Route) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { headers, body, query, params } = req
        const { statusCode, data } = await route.route({ headers, body, query, params })

        res.status(statusCode).send(data)
      } catch (error) {
        next(error)
      }
    }
}
