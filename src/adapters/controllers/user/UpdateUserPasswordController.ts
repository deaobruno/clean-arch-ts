import BaseController from '../BaseController'
import UpdateUserPassword from '../../../application/useCases/user/UpdateUserPassword'
import UpdateUserPasswordSchema from '../../../infra/schemas/user/UpdateUserPasswordSchema'

export default class UpdateUserPasswordController extends BaseController {
  constructor(useCase: UpdateUserPassword, schema: typeof UpdateUserPasswordSchema) {
    super(useCase, schema)
  }
}
