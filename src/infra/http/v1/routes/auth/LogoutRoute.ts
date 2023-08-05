import LogoutController from '../../../../../adapters/controllers/auth/LogoutController'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import ValidateInputMiddleware from '../../../../../adapters/middlewares/validation/ValidateInputMiddleware'
import BaseRoute from '../BaseRoute'

type Middlewares = [ValidateInputMiddleware, ValidateAuthenticationMiddleware]

export default class LogoutRoute extends BaseRoute {
  method = 'delete'
  statusCode = 204

  constructor(path: string, controller: LogoutController, middlewares: Middlewares) {
    super({ path, controller, middlewares })
  }
}
