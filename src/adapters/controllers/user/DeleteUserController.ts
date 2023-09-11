import BaseController from '../BaseController'
import DeleteUser from '../../../application/useCases/user/DeleteUser'
import DeleteUserSchema from '../../../infra/schemas/user/DeleteUserSchema'
import ControllerConfig from '../ControllerConfig'

export default class DeleteUserController extends BaseController {
  authenticate = true
  authorize = true

  constructor(config: ControllerConfig<DeleteUser, typeof DeleteUserSchema>) {
    super(config)
  }
}
