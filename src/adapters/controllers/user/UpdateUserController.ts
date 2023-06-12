import UpdateUser from '../../../application/use_cases/user/UpdateUser'
import UserRepository from '../../../domain/repositories/UserRepository'
import Schema from '../../../infra/schemas/Schema'
import Controller from '../Controller'

export default class UpdateUserController extends Controller {
  constructor(repository: UserRepository, inputSchema?: Schema, useCase = new UpdateUser(repository)) {
    super({ useCase, inputSchema })
  }
}
