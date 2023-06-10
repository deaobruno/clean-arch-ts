import Schema from '../../infra/schemas/Schema'
import UseCase from '../../application/UseCase'
import Controller from './Controller'
import FindUsers from '../../application/use_cases/user/FindUsers'
import UserRepository from '../../domain/repositories/UserRepository'

export default class FindUsersController extends Controller {
  constructor(repository: UserRepository, inputSchema?: Schema, useCase: UseCase = new FindUsers(repository)) {
    super({ useCase, inputSchema, statusCode: 200 })
  }
}
