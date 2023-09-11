import BaseRoute from '../BaseRoute'
import FindUsersController from '../../../../../adapters/controllers/user/FindUsersController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'

export default class FindUsersRoute extends BaseRoute {
  method = 'get'
  statusCode = 200

  constructor(path: string, controller: FindUsersController, presenter: CustomerPresenter) {
    super({ path, controller, presenter })
  }
}
