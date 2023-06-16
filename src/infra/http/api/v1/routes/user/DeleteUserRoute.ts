import Route from '../Route'
import DeleteUserController from '../../../../../../adapters/controllers/user/DeleteUserController'

export default class DeleteUserRoute extends Route {
  method = 'delete'
  statusCode = 204

  constructor(path: string, controller: DeleteUserController) {
    super({ path, controller })
  }
}
