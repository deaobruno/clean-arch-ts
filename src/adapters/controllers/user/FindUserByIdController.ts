import FindUserById from '../../../application/use_cases/user/FindUserById'
import Controller from '../Controller'

export default class FindUserByIdController extends Controller {
  constructor(useCase: FindUserById) {
    super({ useCase })
  }
}
