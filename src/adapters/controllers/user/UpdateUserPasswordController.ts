import BaseController from '../BaseController'
import UpdateUserPassword from '../../../application/useCases/user/UpdateUserPassword'

export default class UpdateUserPasswordController extends BaseController {
  constructor(useCase: UpdateUserPassword) {
    super(useCase)
  }
}
