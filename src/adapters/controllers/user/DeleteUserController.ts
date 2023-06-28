import BaseController from '../BaseController'
import DeleteUser from '../../../application/use_cases/user/DeleteUser'
import DeleteUserSchema from '../../../infra/schemas/user/DeleteUserSchema'

export default class DeleteUserController extends BaseController {
  constructor(useCase: DeleteUser, inputSchema: typeof DeleteUserSchema) {
    super({ useCase, inputSchema })
  }
}
