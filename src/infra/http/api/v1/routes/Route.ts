import Controller from '../../../../../adapters/controllers/Controller'
import Middleware from '../../../../../adapters/middlewares/Middleware'
import Presenter from '../../../../../adapters/presenters/Presenter'

type RouteConfig = {
  path: string,
  controller: Controller,
  presenter?: Presenter,
  middlewares?: Middleware[]
}

export default abstract class Route {
  readonly abstract method: string
  readonly abstract statusCode: number
  readonly path: string
  private _controller: Controller
  private _presenter?: Presenter
  readonly middlewares?: Middleware[]

  constructor(routeConfig: RouteConfig) {
    const { path, controller, presenter, middlewares } = routeConfig

    this.path = path
    this._controller = controller
    this._presenter = presenter
    this.middlewares = middlewares
  }

  private _formatResponseData(data: any) {
    if (!this._presenter) {
      return data
    }

    return Array.isArray(data)
      ? data.map(this._presenter.present)
      : this._presenter.present(data)
  }

  handle = async (payload: any): Promise<any> =>
    this._formatResponseData(await this._controller.handle(payload))
}
