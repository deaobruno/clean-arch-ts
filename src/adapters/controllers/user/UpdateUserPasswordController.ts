import UpdateUserPassword from '../../../application/use_cases/user/UpdateUserPassword'
import UserRepository from '../../../domain/repositories/UserRepository'
import Schema from '../../../infra/schemas/Schema'
import Controller from '../Controller'

export default class UpdateUserPasswordController extends Controller {
  constructor(repository: UserRepository, inputSchema?: Schema, useCase = new UpdateUserPassword(repository)) {
    super({ useCase, inputSchema, statusCode: 200 })
  }
}
