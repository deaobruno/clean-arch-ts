import BaseController from '../BaseController'
import UpdateUserPassword from '../../../application/useCases/user/UpdateUserPassword'
import UpdateUserPasswordSchema from '../../../infra/schemas/user/UpdateUserPasswordSchema'
import ControllerConfig from '../ControllerConfig'

export default class UpdateUserPasswordController extends BaseController {
  authenticate = true

  constructor(config: ControllerConfig<UpdateUserPassword, typeof UpdateUserPasswordSchema>) {
    super(config)
  }
}
