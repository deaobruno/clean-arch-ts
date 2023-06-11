import Schema from '../../../infra/schemas/Schema'
import Controller from '../Controller'
import { FindUsers, FindUsersUseCase } from '../../../application/use_cases/user/FindUsers'
import UserRepository from '../../../domain/repositories/UserRepository'

export default class FindUsersController extends Controller {
  constructor(repository: UserRepository, inputSchema?: Schema, useCase: FindUsersUseCase = new FindUsers(repository)) {
    super({ useCase, inputSchema, statusCode: 200 })
  }
}
