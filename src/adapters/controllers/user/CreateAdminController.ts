import Schema from '../../../infra/schemas/Schema'
import Controller from '../Controller'
import UserRepository from '../../../domain/repositories/UserRepository'
import CreateAdmin from '../../../application/use_cases/user/CreateAdmin'

export default class CreateAdminController extends Controller {
  constructor(repository: UserRepository, inputSchema?: Schema, useCase = new CreateAdmin(repository)) {
    super({ useCase, inputSchema, statusCode: 201 })
  }
}
