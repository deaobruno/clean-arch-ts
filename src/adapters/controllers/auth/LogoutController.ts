import BaseController from '../BaseController'
import DeleteRefreshToken from '../../../application/useCases/auth/DeleteRefreshToken'

export default class LogoutController extends BaseController {
  constructor(useCase: DeleteRefreshToken) {
    super(useCase)
  }
}
