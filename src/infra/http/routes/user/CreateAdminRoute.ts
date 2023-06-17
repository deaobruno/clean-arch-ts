import BaseRoute from '../BaseRoute'
import CreateAdminController from '../../../../adapters/controllers/user/CreateAdminController'
import AdminPresenter from '../../../../adapters/presenters/user/AdminPresenter'
import BaseMiddleware from '../../../../adapters/middlewares/BaseMiddleware'

export default class CreateAdminRoute extends BaseRoute {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: CreateAdminController, presenter: AdminPresenter, middlewares: BaseMiddleware[]) {
    super({ path, controller, presenter, middlewares })
  }
}
