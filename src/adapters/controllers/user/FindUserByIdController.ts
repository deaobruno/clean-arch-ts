import FindUserById from '../../../application/use_cases/user/FindUserById'
import UserRepository from '../../../domain/repositories/UserRepository'
import Schema from '../../../infra/schemas/Schema'
import Controller from '../Controller'

export default class FindUserByIdController extends Controller {
  constructor(repository: UserRepository, inputSchema?: Schema, useCase = new FindUserById(repository)) {
    super({ useCase, inputSchema, statusCode: 200 })
  }
}
