import BaseRoute from '../BaseRoute'
import UpdateUserPasswordController from '../../../../../adapters/controllers/user/UpdateUserPasswordController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'

type Middlewares = [ValidateAuthenticationMiddleware]

export default class UpdateUserPasswordRoute extends BaseRoute {
  method = 'put'
  statusCode = 200

  constructor(path: string, controller: UpdateUserPasswordController, presenter: CustomerPresenter, middlewares: Middlewares) {
    super({ path, controller, presenter, middlewares })
  }
}
