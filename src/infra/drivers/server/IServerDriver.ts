import BaseRoute from '../../http/BaseRoute'

export default interface IServer {
  start(routes: BaseRoute[], prefix?: string): void
  stop(callback?: (error?: Error) => void): void
}
