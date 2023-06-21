import BaseController from '../BaseController'
import { UpdateUserPassword } from '../../../application/use_cases/user/UpdateUserPassword'
import UpdateUserSchema from '../../../infra/schemas/user/UpdateUserSchema'

export default class UpdateUserPasswordController extends BaseController {
  constructor(useCase: UpdateUserPassword, inputSchema: typeof UpdateUserSchema) {
    super({ useCase, inputSchema })
  }
}
