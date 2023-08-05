import BaseController from '../BaseController'
import AuthenticateUser from '../../../application/useCases/auth/AuthenticateUser'

export default class AuthenticateUserController extends BaseController {
  constructor(useCase: AuthenticateUser) {
    super(useCase)
  }
}
