import AuthenticatedController from '../AuthenticatedController'
import UpdateUserPassword from '../../../application/useCases/user/UpdateUserPassword'
import UpdateUserPasswordSchema from '../../../infra/schemas/user/UpdateUserPasswordSchema'
import ControllerConfig from '../ControllerConfig'

export default class UpdateUserPasswordController extends AuthenticatedController {
  constructor(config: ControllerConfig<UpdateUserPassword, typeof UpdateUserPasswordSchema>) {
    super(config)
  }
}
