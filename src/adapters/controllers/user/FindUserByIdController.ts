import BaseController from '../BaseController'
import FindUserById from '../../../application/useCases/user/FindUserById'

export default class FindUserByIdController extends BaseController {
  constructor(useCase: FindUserById) {
    super(useCase)
  }
}
