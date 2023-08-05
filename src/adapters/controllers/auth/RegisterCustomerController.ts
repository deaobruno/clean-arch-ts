import BaseController from '../BaseController'
import RegisterCustomer from '../../../application/useCases/auth/RegisterCustomer'

export default class RegisterCustomerController extends BaseController {
  constructor(useCase: RegisterCustomer) {
    super(useCase)
  }
}
