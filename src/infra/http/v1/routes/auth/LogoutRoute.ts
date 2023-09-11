import BaseRoute from '../BaseRoute'
import LogoutController from '../../../../../adapters/controllers/auth/LogoutController'

export default class LogoutRoute extends BaseRoute {
  method = 'delete'
  statusCode = 204

  constructor(path: string, controller: LogoutController) {
    super({ path, controller })
  }
}
