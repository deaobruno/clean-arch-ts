import AuthenticatedController from '../AuthenticatedController'
import RefreshAccessToken from '../../../application/useCases/auth/RefreshAccessToken'
import RefreshAccessTokenSchema from '../../../infra/schemas/auth/RefreshAccessTokenSchema'
import ControllerConfig from '../ControllerConfig'

export default class RefreshAccessTokenController extends AuthenticatedController {
  statusCode = 200

  constructor(config: ControllerConfig<RefreshAccessToken, typeof RefreshAccessTokenSchema>) {
    super(config)
  }
}
