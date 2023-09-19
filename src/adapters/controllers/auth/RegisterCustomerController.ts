import BaseController from '../BaseController'
import RegisterCustomer from '../../../application/useCases/auth/RegisterCustomer'
import RegisterCustomerSchema from '../../../infra/schemas/auth/RegisterCustomerSchema'
import ControllerConfig from '../ControllerConfig'
import CustomerPresenter from '../../presenters/user/CustomerPresenter'

export default class RegisterCustomerController extends BaseController {
  statusCode = 201

  constructor(config: ControllerConfig<RegisterCustomer, typeof RegisterCustomerSchema, CustomerPresenter>) {
    super(config)
  }
}
