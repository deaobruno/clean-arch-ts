import BaseController from '../../adapters/controllers/BaseController'
import BaseMiddleware from '../../adapters/middlewares/BaseMiddleware'
import IPresenter from '../../adapters/presenters/IPresenter'

type RouteConfig = {
  path: string,
  controller: BaseController,
  presenter?: IPresenter,
  middlewares?: BaseMiddleware[]
}

export default abstract class BaseRoute {
  readonly abstract method: string
  readonly abstract statusCode: number
  readonly path: string
  private _controller: BaseController
  private _presenter?: IPresenter
  readonly middlewares?: BaseMiddleware[]

  constructor(routeConfig: RouteConfig) {
    const { path, controller, presenter, middlewares } = routeConfig

    this.path = path
    this._controller = controller
    this._presenter = presenter
    this.middlewares = middlewares
  }

  handle = async (payload: any): Promise<any> => {
    const data = await this._controller.handle(payload)

    if (!this._presenter)
      return data

    return Array.isArray(data)
      ? data.map(this._presenter.present)
      : this._presenter.present(data)
  }
}
