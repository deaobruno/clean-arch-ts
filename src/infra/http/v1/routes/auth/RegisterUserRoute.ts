import RegisterUserController from '../../../../../adapters/controllers/auth/RegisterUserController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'
import BaseRoute from '../../../BaseRoute'

export default class RegisterUserRoute extends BaseRoute {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: RegisterUserController, presenter: CustomerPresenter) {
    super({ path, controller, presenter })
  }
}
