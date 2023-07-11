import BaseController from '../BaseController'
import DeleteUser from '../../../application/use_cases/user/DeleteUser'

export default class DeleteUserController extends BaseController {
  constructor(useCase: DeleteUser) {
    super(useCase)
  }
}
