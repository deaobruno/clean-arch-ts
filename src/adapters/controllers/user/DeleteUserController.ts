import AuthorizedController from '../AuthorizedController'
import DeleteUser from '../../../application/useCases/user/DeleteUser'
import DeleteUserSchema from '../../../infra/schemas/user/DeleteUserSchema'
import ControllerConfig from '../ControllerConfig'

export default class DeleteUserController extends AuthorizedController {
  statusCode = 204

  constructor(config: ControllerConfig<DeleteUser, typeof DeleteUserSchema>) {
    super(config)
  }
}
