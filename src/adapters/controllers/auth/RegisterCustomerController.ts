import BaseController from '../BaseController'
import RegisterCustomer from '../../../application/useCases/auth/RegisterCustomer'
import RegisterCustomerSchema from '../../../infra/schemas/auth/RegisterCustomerSchema'
import ControllerConfig from '../ControllerConfig'

export default class RegisterCustomerController extends BaseController {
  constructor(config: ControllerConfig<RegisterCustomer, typeof RegisterCustomerSchema>) {
    super(config)
  }
}
