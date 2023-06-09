import Route from './Route'

export default interface Server {
  start(): void
  stop(callback?: (error?: Error) => void): void
  route(route: Route): any
  adaptRoute: (route: Route) => (req: any, res: any, next: any) => Promise<void>
}
