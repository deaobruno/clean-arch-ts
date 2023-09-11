import BaseController from '../BaseController'
import RefreshAccessToken from '../../../application/useCases/auth/RefreshAccessToken'
import RefreshAccessTokenSchema from '../../../infra/schemas/auth/RefreshAccessTokenSchema'
import ControllerConfig from '../ControllerConfig'

export default class RefreshAccessTokenController extends BaseController {
  authenticate = true

  constructor(config: ControllerConfig<RefreshAccessToken, typeof RefreshAccessTokenSchema>) {
    super(config)
  }
}
