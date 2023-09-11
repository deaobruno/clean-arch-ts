import BaseController from '../BaseController'
import FindUserById from '../../../application/useCases/user/FindUserById'
import FindUserByIdSchema from '../../../infra/schemas/user/FindUserByIdSchema'
import ControllerConfig from '../ControllerConfig'

export default class FindUserByIdController extends BaseController {
  authenticate = true

  constructor(config: ControllerConfig<FindUserById, typeof FindUserByIdSchema>) {
    super(config)
  }
}
