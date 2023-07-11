import BaseRoute from '../../../BaseRoute'
import FindUsersController from '../../../../../adapters/controllers/user/FindUsersController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import ValidateInputMiddleware from '../../../../../adapters/middlewares/validation/ValidateInputMiddleware'
import ValidateAuthorizationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthorizationMiddleware'

type Middlewares = [ValidateInputMiddleware, ValidateAuthenticationMiddleware, ValidateAuthorizationMiddleware]

export default class FindUsersRoute extends BaseRoute {
  method = 'get'
  statusCode = 200

  constructor(path: string, controller: FindUsersController, presenter: CustomerPresenter, middlewares: Middlewares) {
    super({ path, controller, presenter, middlewares })
  }
}
