import Controller from '../../adapters/controllers/Controller'
import Presenter from '../../adapters/presenters/Presenter'
import Route from './Route'

export default interface Server {
  start(): void
  stop(callback?: (error?: Error) => void): void
  route(method: string, path: string, controller: Controller, presenter?: Presenter): any
  adaptRoute: (route: Route) => (req: any, res: any, next: any) => Promise<void>
}
