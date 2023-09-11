import BaseController from '../BaseController'
import UpdateUser from '../../../application/useCases/user/UpdateUser'
import UpdateUserSchema from '../../../infra/schemas/user/UpdateUserSchema'
import ControllerConfig from '../ControllerConfig'

export default class UpdateUserController extends BaseController {
  authenticate = true

  constructor(config: ControllerConfig<UpdateUser, typeof UpdateUserSchema>) {
    super(config)
  }
}
