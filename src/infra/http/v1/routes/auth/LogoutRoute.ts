import LogoutController from '../../../../../adapters/controllers/auth/LogoutController'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import BaseRoute from '../BaseRoute'

type Middlewares = [ValidateAuthenticationMiddleware]

export default class LogoutRoute extends BaseRoute {
  method = 'delete'
  statusCode = 204

  constructor(path: string, controller: LogoutController, middlewares: Middlewares) {
    super({ path, controller, middlewares })
  }
}
