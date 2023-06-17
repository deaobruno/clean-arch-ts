import BaseMiddleware from '../../adapters/middlewares/BaseMiddleware'
import BaseRoute from './routes/BaseRoute'

export default interface IServer {
  start(routes: BaseRoute[]): void
  stop(callback?: (error?: Error) => void): void
  adaptRoutes(routes: BaseRoute[]): any[]
  adaptMiddleware: (middleware: BaseMiddleware) => (request: any, response: any, callback?: any) => Promise<void>
  adaptHandler: (route: BaseRoute) => (request: any, response: any, callback?: any) => Promise<void>
}
