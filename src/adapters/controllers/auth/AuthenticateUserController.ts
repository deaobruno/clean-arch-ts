import BaseController from '../BaseController'
import AuthenticateUser from '../../../application/use_cases/auth/AuthenticateUser'

export default class AuthenticateUserController extends BaseController {
  constructor(useCase: AuthenticateUser) {
    super(useCase)
  }
}
