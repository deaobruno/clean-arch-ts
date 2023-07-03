import BaseController from '../BaseController'
import UpdateUserPassword from '../../../application/use_cases/user/UpdateUserPassword'

export default class UpdateUserPasswordController extends BaseController {
  constructor(useCase: UpdateUserPassword) {
    super(useCase)
  }
}
