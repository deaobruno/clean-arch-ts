import Controller from '../Controller'
import CreateAdmin from '../../../application/use_cases/user/CreateAdmin'
import CreateUserSchema from '../../../infra/schemas/user/CreateUserSchema'

export default class CreateAdminController extends Controller {
  constructor(useCase: CreateAdmin, inputSchema: typeof CreateUserSchema) {
    super({ useCase, inputSchema })
  }
}
