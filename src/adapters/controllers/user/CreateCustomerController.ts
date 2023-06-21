import BaseController from '../BaseController'
import CreateCustomer from '../../../application/use_cases/user/CreateCustomer'
import CreateAdminSchema from '../../../infra/schemas/user/CreateAdminSchema'

export default class CreateCustomerController extends BaseController {
  constructor(useCase: CreateCustomer, inputSchema: typeof CreateAdminSchema) {
    super({ useCase, inputSchema })
  }
}
