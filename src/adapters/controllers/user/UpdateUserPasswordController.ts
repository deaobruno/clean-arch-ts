import Controller from '../Controller'
import UpdateUserPassword from '../../../application/use_cases/user/UpdateUserPassword'
import UpdateUserSchema from '../../../infra/schemas/user/UpdateUserSchema'

export default class UpdateUserPasswordController extends Controller {
  constructor(useCase: UpdateUserPassword, inputSchema: typeof UpdateUserSchema) {
    super({ useCase, inputSchema })
  }
}
