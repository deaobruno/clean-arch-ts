import AuthorizedController from '../AuthorizedController'
import CreateAdmin from '../../../application/useCases/user/CreateAdmin'
import CreateAdminSchema from '../../../infra/schemas/user/CreateAdminSchema'
import ControllerConfig from '../ControllerConfig'
import AdminPresenter from '../../presenters/user/AdminPresenter'

export default class CreateAdminController extends AuthorizedController {
  statusCode = 201

  constructor(config: ControllerConfig<CreateAdmin, typeof CreateAdminSchema, AdminPresenter>) {
    super(config)
  }
}
