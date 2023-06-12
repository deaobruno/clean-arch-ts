import Controller from '../../adapters/controllers/Controller'
import Middleware from '../../adapters/middlewares/Middleware'
import Presenter from '../../adapters/presenters/Presenter'
import Route from './api/v1/routes/Route'

export default interface Server {
  start(): void
  stop(callback?: (error?: Error) => void): void
  route(method: string, path: string, statusCode: number, controller: Controller, presenter?: Presenter, middlewares?: Middleware[]): any
  getPayload(req: any): any
  adaptMiddleware: (middleware: Middleware) => (req: any, res: any, callback?: any) => Promise<void>
  adaptRoute: (route: Route) => (req: any, res: any, next: any) => Promise<void>
}
