import BaseRoute from './routes/BaseRoute'

export default interface IServer {
  start(routes: BaseRoute[]): void
  stop(callback?: (error?: Error) => void): void
}
