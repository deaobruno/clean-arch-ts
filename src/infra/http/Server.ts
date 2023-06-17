import Middleware from '../../adapters/middlewares/Middleware'
import Route from './api/v1/routes/Route'

export default interface Server {
  start(): void
  stop(callback?: (error?: Error) => void): void
  adaptRoutes(routes: Route[]): any[]
  adaptMiddleware: (middleware: Middleware) => (request: any, response: any, callback?: any) => Promise<void>
  adaptHandler: (route: Route) => (request: any, response: any, callback?: any) => Promise<void>
  getPayload(request: any): any
}
