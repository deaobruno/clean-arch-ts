import BaseController from '../BaseController'
import RegisterCustomer from '../../../application/useCases/auth/RegisterCustomer'
import RegisterCustomerSchema from '../../../infra/schemas/auth/RegisterCustomerSchema'

export default class RegisterCustomerController extends BaseController {
  constructor(useCase: RegisterCustomer, schema: typeof RegisterCustomerSchema) {
    super(useCase, schema)
  }
}
