import Controller from '../Controller'
import DeleteUser from '../../../application/use_cases/user/DeleteUser'

export default class DeleteUserController extends Controller {
  constructor(useCase: DeleteUser) {
    super({ useCase })
  }
}
