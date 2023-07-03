import BaseRoute from '../../../BaseRoute'
import CreateAdminController from '../../../../../adapters/controllers/user/CreateAdminController'
import AdminPresenter from '../../../../../adapters/presenters/user/AdminPresenter'
import ValidateAuthenticationMiddleware from '../../../../../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import { LevelEnum } from '../../../../../domain/User'
import ValidateInputMiddleware from '../../../../../adapters/middlewares/validation/ValidateInputMiddleware'

type Middlewares = [ValidateInputMiddleware, ValidateAuthenticationMiddleware]

export default class CreateAdminRoute extends BaseRoute {
  method = 'post'
  statusCode = 201
  allowedLevels = [LevelEnum.ADMIN, LevelEnum.ROOT]

  constructor(path: string, controller: CreateAdminController, presenter: AdminPresenter, middlewares: Middlewares) {
    super({ path, controller, presenter, middlewares })
  }
}
