import Controller from '../Controller'
import CreateCustomer from '../../../application/use_cases/user/CreateCustomer'
import CreateUserSchema from '../../../infra/schemas/user/CreateUserSchema'

export default class CreateCustomerController extends Controller {
  constructor(useCase: CreateCustomer, inputSchema: typeof CreateUserSchema) {
    super({ useCase, inputSchema })
  }
}
