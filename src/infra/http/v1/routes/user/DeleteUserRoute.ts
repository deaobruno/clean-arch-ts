import BaseRoute from '../BaseRoute'
import DeleteUserController from '../../../../../adapters/controllers/user/DeleteUserController'

export default class DeleteUserRoute extends BaseRoute {
  method = 'delete'
  statusCode = 204

  constructor(path: string, controller: DeleteUserController) {
    super({ path, controller })
  }
}
