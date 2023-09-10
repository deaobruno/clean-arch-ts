import BaseRoute from '../BaseRoute'
import FindUserByIdController from '../../../../../adapters/controllers/user/FindUserByIdController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'

type Middlewares = [ValidateAuthenticationMiddleware]

export default class FindUserByIdRoute extends BaseRoute {
  method = 'get'
  statusCode = 200

  constructor(path: string, controller: FindUserByIdController, presenter: CustomerPresenter, middlewares: Middlewares) {
    super({ path, controller, presenter, middlewares })
  }
}
