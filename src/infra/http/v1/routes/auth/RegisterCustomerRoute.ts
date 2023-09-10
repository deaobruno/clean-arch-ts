import RegisterCustomerController from '../../../../../adapters/controllers/auth/RegisterCustomerController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'
import BaseRoute from '../BaseRoute'

export default class RegisterCustomerRoute extends BaseRoute {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: RegisterCustomerController, presenter: CustomerPresenter) {
    super({ path, controller, presenter })
  }
}
