import BaseRoute from '../../../BaseRoute'
import UpdateUserController from '../../../../../adapters/controllers/user/UpdateUserController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import ValidateInputMiddleware from '../../../../../adapters/middlewares/validation/ValidateInputMiddleware'

type Middlewares = [ValidateInputMiddleware, ValidateAuthenticationMiddleware]

export default class UpdateUserRoute extends BaseRoute {
  method = 'put'
  statusCode = 200

  constructor(path: string, controller: UpdateUserController, presenter: CustomerPresenter, middlewares: Middlewares) {
    super({ path, controller, presenter, middlewares })
  }
}
