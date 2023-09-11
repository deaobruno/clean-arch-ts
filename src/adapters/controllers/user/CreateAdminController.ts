import BaseController from '../BaseController'
import CreateAdmin from '../../../application/useCases/user/CreateAdmin'
import CreateAdminSchema from '../../../infra/schemas/user/CreateAdminSchema'
import ControllerConfig from '../ControllerConfig'

export default class CreateAdminController extends BaseController {
  authenticate = true
  authorize = true

  constructor(config: ControllerConfig<CreateAdmin, typeof CreateAdminSchema>) {
    super(config)
  }
}
