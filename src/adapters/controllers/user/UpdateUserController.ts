import BaseController from '../BaseController'
import UpdateUser from '../../../application/useCases/user/UpdateUser'
import UpdateUserSchema from '../../../infra/schemas/user/UpdateUserSchema'

export default class UpdateUserController extends BaseController {
  constructor(useCase: UpdateUser, schema: typeof UpdateUserSchema) {
    super(useCase, schema)
  }
}
