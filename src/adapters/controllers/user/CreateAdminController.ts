import AuthorizedController from '../AuthorizedController'
import CreateAdmin from '../../../application/useCases/user/CreateAdmin'
import CreateAdminSchema from '../../../infra/schemas/user/CreateAdminSchema'
import ControllerConfig from '../ControllerConfig'

export default class CreateAdminController extends AuthorizedController {
  constructor(config: ControllerConfig<CreateAdmin, typeof CreateAdminSchema>) {
    super(config)
  }
}
