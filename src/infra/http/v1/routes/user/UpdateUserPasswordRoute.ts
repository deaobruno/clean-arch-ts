import BaseRoute from '../../../BaseRoute'
import UpdateUserPasswordController from '../../../../../adapters/controllers/user/UpdateUserPasswordController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'

export default class UpdateUserPasswordRoute extends BaseRoute {
  method = 'put'
  statusCode = 200

  constructor(path: string, controller: UpdateUserPasswordController, presenter: CustomerPresenter) {
    super({ path, controller, presenter })
  }
}
