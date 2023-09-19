import BaseController from '../BaseController'
import AuthenticateUser from '../../../application/useCases/auth/AuthenticateUser'
import AuthenticateUserSchema from '../../../infra/schemas/auth/AuthenticateUserSchema'
import ControllerConfig from '../ControllerConfig'

export default class AuthenticateUserController extends BaseController {
  statusCode = 200

  constructor(config: ControllerConfig<AuthenticateUser, typeof AuthenticateUserSchema>) {
    super(config)
  }
}
