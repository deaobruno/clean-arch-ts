import Route from '../Route'
import CreateCustomerController from '../../../../../../adapters/controllers/user/CreateCustomerController'
import CustomerPresenter from '../../../../../../adapters/presenters/user/CustomerPresenter'

export default class CreateCustomerRoute extends Route {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: CreateCustomerController, presenter: CustomerPresenter) {
    super({ path, controller, presenter })
  }
}
