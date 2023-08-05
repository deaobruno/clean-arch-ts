import BaseController from '../BaseController'
import DeleteUser from '../../../application/useCases/user/DeleteUser'

export default class DeleteUserController extends BaseController {
  constructor(useCase: DeleteUser) {
    super(useCase)
  }
}
