import BaseRoute from '../BaseRoute'
import UpdateUserController from '../../../../../adapters/controllers/user/UpdateUserController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'

export default class UpdateUserRoute extends BaseRoute {
  method = 'put'
  statusCode = 200

  constructor(path: string, controller: UpdateUserController, presenter: CustomerPresenter) {
    super({ path, controller, presenter })
  }
}
