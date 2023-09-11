import BaseController from '../../../../adapters/controllers/BaseController'
import IPresenter from '../../../../adapters/presenters/IPresenter'

type RouteConfig = {
  path: string
  controller: BaseController
  presenter?: IPresenter
}

export default abstract class BaseRoute {
  readonly abstract method: string
  readonly abstract statusCode: number
  readonly path: string
  private _controller: BaseController
  private _presenter?: IPresenter

  constructor(routeConfig: RouteConfig) {
    const { path, controller, presenter } = routeConfig

    this.path = path
    this._controller = controller
    this._presenter = presenter
  }

  handle = async (headers: any, payload: any): Promise<any> => {
    const data = await this._controller.handle(headers, payload)

    if (data instanceof Error || !this._presenter)
      return data

    return Array.isArray(data)
      ? data.map(this._presenter.present)
      : this._presenter.present(data)
  }
}
