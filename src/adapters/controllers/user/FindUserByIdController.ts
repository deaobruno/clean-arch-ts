import BaseController from '../BaseController'
import FindUserById from '../../../application/use_cases/user/FindUserById'

export default class FindUserByIdController extends BaseController {
  constructor(useCase: FindUserById) {
    super(useCase)
  }
}
