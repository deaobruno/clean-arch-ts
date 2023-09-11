import AuthenticatedController from '../AuthenticatedController'
import DeleteRefreshToken from '../../../application/useCases/auth/DeleteRefreshToken'
import LogoutSchema from '../../../infra/schemas/auth/LogoutSchema'
import ControllerConfig from '../ControllerConfig'

export default class LogoutController extends AuthenticatedController {
  constructor(config: ControllerConfig<DeleteRefreshToken, typeof LogoutSchema>) {
    super(config)
  }
}
