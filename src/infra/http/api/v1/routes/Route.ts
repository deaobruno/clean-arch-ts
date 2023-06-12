import Controller from '../../../../../adapters/controllers/Controller'
import Presenter from '../../../../../adapters/presenters/Presenter'

export default class Route {
  constructor(readonly method: string, readonly path: string, readonly statusCode: number, private _controller: Controller, private _presenter?: Presenter) {}

  private _formatResponseData(data: any) {
    if (!this._presenter) {
      return data
    }

    return Array.isArray(data)
      ? data.map(this._presenter.present)
      : this._presenter.present(data)
  }

  route = async (payload: any): Promise<any> =>
    this._formatResponseData(await this._controller.handle(payload))
}
