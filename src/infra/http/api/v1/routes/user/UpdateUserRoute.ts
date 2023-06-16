import Route from '../Route'
import UpdateUserController from '../../../../../../adapters/controllers/user/UpdateUserController'
import CustomerPresenter from '../../../../../../adapters/presenters/user/CustomerPresenter'

export default class UpdateUserRoute extends Route {
  method = 'put'
  statusCode = 200

  constructor(path: string, controller: UpdateUserController, presenter: CustomerPresenter) {
    super({ path, controller, presenter })
  }
}
