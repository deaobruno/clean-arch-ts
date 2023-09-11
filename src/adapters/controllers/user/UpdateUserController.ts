import AuthenticatedController from '../AuthenticatedController'
import UpdateUser from '../../../application/useCases/user/UpdateUser'
import UpdateUserSchema from '../../../infra/schemas/user/UpdateUserSchema'
import ControllerConfig from '../ControllerConfig'

export default class UpdateUserController extends AuthenticatedController {
  constructor(config: ControllerConfig<UpdateUser, typeof UpdateUserSchema>) {
    super(config)
  }
}
