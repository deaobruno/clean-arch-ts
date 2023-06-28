import BaseRoute from '../../../BaseRoute'
import FindUserByIdController from '../../../../../adapters/controllers/user/FindUserByIdController'
import CustomerPresenter from '../../../../../adapters/presenters/user/CustomerPresenter'

export default class FindUserByIdRoute extends BaseRoute {
  method = 'get'
  statusCode = 200

  constructor(path: string, controller: FindUserByIdController, presenter: CustomerPresenter) {
    super({ path, controller, presenter })
  }
}
