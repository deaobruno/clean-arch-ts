import BaseRoute from '../BaseRoute'
import CreateAdminController from '../../../../adapters/controllers/user/CreateAdminController'
import AdminPresenter from '../../../../adapters/presenters/user/AdminPresenter'

export default class CreateAdminRoute extends BaseRoute {
  method = 'post'
  statusCode = 201

  constructor(path: string, controller: CreateAdminController, presenter: AdminPresenter) {
    super({ path, controller, presenter })
  }
}
