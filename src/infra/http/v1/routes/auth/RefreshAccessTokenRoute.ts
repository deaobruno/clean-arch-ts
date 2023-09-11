import BaseRoute from '../BaseRoute'
import RefreshTokenController from '../../../../../adapters/controllers/auth/RefreshAccessTokenController'

export default class RefreshAccessTokenRoute extends BaseRoute {
  method = 'post'
  statusCode = 200

  constructor(path: string, controller: RefreshTokenController) {
    super({ path, controller })
  }
}
