import RefreshTokenController from '../../../../../adapters/controllers/auth/RefreshAccessTokenController'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import ValidateInputMiddleware from '../../../../../adapters/middlewares/validation/ValidateInputMiddleware'
import BaseRoute from '../../../BaseRoute'

type Middlewares = [ValidateInputMiddleware, ValidateAuthenticationMiddleware]

export default class RefreshAccessTokenRoute extends BaseRoute {
  method = 'post'
  statusCode = 200

  constructor(path: string, controller: RefreshTokenController, middlewares: Middlewares) {
    super({ path, controller, middlewares })
  }
}
