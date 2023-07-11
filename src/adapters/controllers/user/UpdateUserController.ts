import BaseController from '../BaseController'
import UpdateUser from '../../../application/use_cases/user/UpdateUser'

export default class UpdateUserController extends BaseController {
  constructor(useCase: UpdateUser) {
    super(useCase)
  }
}
