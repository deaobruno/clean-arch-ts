import Controller from '../../adapters/controllers/Controller'
import Presenter from '../../adapters/presenters/Presenter'
import HttpRequest from './HttpRequest'
import HttpResponse from './HttpResponse'

export default class Route {
  constructor(readonly method: string, readonly path: string, private _controller: Controller, private _presenter?: Presenter) {}

  private _getPayload(request: HttpRequest) {
    const { body, query, params } = request
    const reqData = [body, query, params].filter(
      (value) => Object.keys(value).length !== 0
    )
    const data = reqData.length > 1
      ? [Object.assign(reqData[0], reqData[1], reqData[2])]
      : reqData

    return data[0] ?? {}
  }

  private _formatResponseData(data: any) {
    if (!this._presenter) {
      return data
    }

    return Array.isArray(data)
      ? data.map(this._presenter.present)
      : this._presenter.present(data)
  }

  async route(request: HttpRequest): Promise<HttpResponse> {
    const payload = this._getPayload(request)
    const { statusCode, response } = await this._controller.handle(payload)
    const data = this._formatResponseData(response)

    return {
      statusCode,
      data
    }
  }
}
