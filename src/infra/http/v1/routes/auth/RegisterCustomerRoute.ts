import RegisterCustomerController from '../../../../../adapters/controllers/auth/RegisterCustomerController'
import ValidateInputMiddleware from '../../../../../adapters/middlewares/validation/ValidateInputMiddleware'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'
import BaseRoute from '../../../BaseRoute'

type Middlewares = [ValidateInputMiddleware]

export default class RegisterCustomerRoute extends BaseRoute {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: RegisterCustomerController, presenter: CustomerPresenter, middlewares: Middlewares) {
    super({ path, controller, presenter, middlewares })
  }
}
