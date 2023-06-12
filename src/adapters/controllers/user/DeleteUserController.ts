import DeleteUser from '../../../application/use_cases/user/DeleteUser'
import UserRepository from '../../../domain/repositories/UserRepository'
import Schema from '../../../infra/schemas/Schema'
import Controller from '../Controller'

export default class DeleteUserController extends Controller {
  constructor(repository: UserRepository, inputSchema?: Schema, useCase = new DeleteUser(repository)) {
    super({ useCase, inputSchema })
  }
}
