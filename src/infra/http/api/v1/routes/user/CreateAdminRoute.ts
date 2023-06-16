import Route from '../Route'
import CreateAdminController from '../../../../../../adapters/controllers/user/CreateAdminController'
import AdminPresenter from '../../../../../../adapters/presenters/user/AdminPresenter'
import Middleware from '../../../../../../adapters/middlewares/Middleware'

export default class CreateAdminRoute extends Route {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: CreateAdminController, presenter: AdminPresenter, middlewares: Middleware[]) {
    super({ path, controller, presenter, middlewares })
  }
}
