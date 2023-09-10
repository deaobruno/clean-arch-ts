import BaseController from '../BaseController'
import DeleteUser from '../../../application/useCases/user/DeleteUser'
import DeleteUserSchema from '../../../infra/schemas/user/DeleteUserSchema'

export default class DeleteUserController extends BaseController {
  constructor(useCase: DeleteUser, schema: typeof DeleteUserSchema) {
    super(useCase, schema)
  }
}
