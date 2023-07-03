import RegisterUserController from '../../../../../adapters/controllers/auth/RegisterUserController'
import ValidateInputMiddleware from '../../../../../adapters/middlewares/validation/ValidateInputMiddleware'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'
import BaseRoute from '../../../BaseRoute'

type Middlewares = [ValidateInputMiddleware]

export default class RegisterUserRoute extends BaseRoute {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: RegisterUserController, presenter: CustomerPresenter, middlewares: Middlewares) {
    super({ path, controller, presenter, middlewares })
  }
}
