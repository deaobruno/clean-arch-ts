import Schema from '../../../infra/schemas/Schema'
import Controller from '../Controller'
import UserRepository from '../../../domain/repositories/UserRepository'
import CreateCustomer from '../../../application/use_cases/user/CreateCustomer'

export default class CreateCustomerController extends Controller {
  constructor(repository: UserRepository, inputSchema?: Schema, useCase = new CreateCustomer(repository)) {
    super({ useCase, inputSchema, statusCode: 201 })
  }
}
