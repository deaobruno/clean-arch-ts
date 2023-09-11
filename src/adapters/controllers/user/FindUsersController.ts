import BaseController from '../BaseController'
import FindUsers from '../../../application/useCases/user/FindUsers'
import FindUsersSchema from '../../../infra/schemas/user/FindUsersSchema'
import ControllerConfig from '../ControllerConfig'

export default class FindUsersController extends BaseController {
  authenticate = true
  authorize = true

  constructor(config: ControllerConfig<FindUsers, typeof FindUsersSchema>) {
    super(config)
  }
}
