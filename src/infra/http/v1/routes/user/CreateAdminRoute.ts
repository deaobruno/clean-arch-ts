import BaseRoute from '../BaseRoute'
import CreateAdminController from '../../../../../adapters/controllers/user/CreateAdminController'
import AdminPresenter from '../../../../../adapters/presenters/user/AdminPresenter'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import ValidateAuthorizationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthorizationMiddleware'

type Middlewares = [ValidateAuthenticationMiddleware, ValidateAuthorizationMiddleware]

export default class CreateAdminRoute extends BaseRoute {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: CreateAdminController, presenter: AdminPresenter, middlewares: Middlewares) {
    super({ path, controller, presenter, middlewares })
  }
}
