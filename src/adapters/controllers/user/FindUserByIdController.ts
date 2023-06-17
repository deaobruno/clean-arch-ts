import FindUserById from '../../../application/use_cases/user/FindUserById'
import BaseController from '../BaseController'

export default class FindUserByIdController extends BaseController {
  constructor(useCase: FindUserById) {
    super({ useCase })
  }
}
