import AuthenticateUserController from '../../../../../adapters/controllers/auth/AuthenticateUserController'
import ValidateInputMiddleware from '../../../../../adapters/middlewares/validation/ValidateInputMiddleware'
import BaseRoute from '../../../BaseRoute'

type Middlewares = [ValidateInputMiddleware]

export default class AuthenticateUserRoute extends BaseRoute {
  method = 'post'
  statusCode = 200

  constructor(path: string, controller: AuthenticateUserController, middlewares: Middlewares) {
    super({ path, controller, middlewares })
  }
}
