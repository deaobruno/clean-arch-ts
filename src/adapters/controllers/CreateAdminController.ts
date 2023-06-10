import Schema from '../../infra/schemas/Schema'
import UseCase from '../../application/UseCase'
import Controller from './Controller'
import UserRepository from '../../domain/repositories/UserRepository'
import CreateAdmin from '../../application/use_cases/user/CreateAdmin'

export default class CreateAdminController extends Controller {
  constructor(repository: UserRepository, inputSchema?: Schema, useCase: UseCase = new CreateAdmin(repository)) {
    super({ useCase, inputSchema, statusCode: 201 })
  }
}
