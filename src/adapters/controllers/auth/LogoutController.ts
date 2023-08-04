import BaseController from '../BaseController'
import DeleteRefreshToken from '../../../application/use_cases/auth/DeleteRefreshToken'

export default class LogoutController extends BaseController {
  constructor(useCase: DeleteRefreshToken) {
    super(useCase)
  }
}
