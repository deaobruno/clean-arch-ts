import AuthorizedController from '../AuthorizedController'
import FindUsers from '../../../application/useCases/user/FindUsers'
import FindUsersSchema from '../../../infra/schemas/user/FindUsersSchema'
import ControllerConfig from '../ControllerConfig'

export default class FindUsersController extends AuthorizedController {
  constructor(config: ControllerConfig<FindUsers, typeof FindUsersSchema>) {
    super(config)
  }
}
