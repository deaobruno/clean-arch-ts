import Schema from '../../infra/schemas/Schema'
import UseCase from '../../application/UseCase'
import Controller from './Controller'

export default class CreateUserController extends Controller {
  constructor(useCase: UseCase, inputSchema?: Schema) {
    super({ useCase, inputSchema, statusCode: 201 })
  }
}
