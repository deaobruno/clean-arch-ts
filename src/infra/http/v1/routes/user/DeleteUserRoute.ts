import BaseRoute from '../../../BaseRoute'
import DeleteUserController from '../../../../../adapters/controllers/user/DeleteUserController'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import ValidateInputMiddleware from '../../../../../adapters/middlewares/validation/ValidateInputMiddleware'
import ValidateAuthorizationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthorizationMiddleware'

type Middlewares = [ValidateInputMiddleware, ValidateAuthenticationMiddleware, ValidateAuthorizationMiddleware]

export default class DeleteUserRoute extends BaseRoute {
  method = 'delete'
  statusCode = 204

  constructor(path: string, controller: DeleteUserController, middlewares: Middlewares) {
    super({ path, controller, middlewares })
  }
}
