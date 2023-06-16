import Controller from '../Controller'
import UpdateUser from '../../../application/use_cases/user/UpdateUser'
import UpdateUserSchema from '../../../infra/schemas/user/UpdateUserSchema'

export default class UpdateUserController extends Controller {
  constructor(useCase: UpdateUser, inputSchema: typeof UpdateUserSchema) {
    super({ useCase, inputSchema })
  }
}
