import BaseController from '../BaseController'
import { UpdateUser } from '../../../application/use_cases/user/UpdateUser'
import UpdateUserSchema from '../../../infra/schemas/user/UpdateUserSchema'

export default class UpdateUserController extends BaseController {
  constructor(useCase: UpdateUser, inputSchema: typeof UpdateUserSchema) {
    super({ useCase, inputSchema })
  }
}
