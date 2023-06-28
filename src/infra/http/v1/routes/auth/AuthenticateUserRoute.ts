import AuthenticateUserController from '../../../../../adapters/controllers/auth/AuthenticateUserController'
import BaseRoute from '../../../BaseRoute'

export default class AuthenticateUserRoute extends BaseRoute {
  method = 'post'
  statusCode = 200

  constructor(path: string, controller: AuthenticateUserController) {
    super({ path, controller })
  }
}
