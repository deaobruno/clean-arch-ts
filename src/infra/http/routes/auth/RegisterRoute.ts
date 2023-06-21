import RegisterController from '../../../../adapters/controllers/auth/RegisterController'
import CustomerPresenter from '../../../../adapters/presenters/user/CustomerPresenter'
import BaseRoute from '../BaseRoute'

export default class RegisterRoute extends BaseRoute {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: RegisterController, presenter: CustomerPresenter) {
    super({ path, controller, presenter })
  }
}
