import AuthorizedController from '../AuthorizedController'
import FindUsers from '../../../application/useCases/user/FindUsers'
import FindUsersSchema from '../../../infra/schemas/user/FindUsersSchema'
import ControllerConfig from '../ControllerConfig'
import AdminPresenter from '../../presenters/user/AdminPresenter'

export default class FindUsersController extends AuthorizedController {
  statusCode = 200

  constructor(config: ControllerConfig<FindUsers, typeof FindUsersSchema, AdminPresenter>) {
    super(config)
  }
}
