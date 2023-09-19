import AuthenticatedController from '../AuthenticatedController'
import FindUserById from '../../../application/useCases/user/FindUserById'
import FindUserByIdSchema from '../../../infra/schemas/user/FindUserByIdSchema'
import ControllerConfig from '../ControllerConfig'
import CustomerPresenter from '../../presenters/user/CustomerPresenter'

export default class FindUserByIdController extends AuthenticatedController {
  statusCode = 200

  constructor(config: ControllerConfig<FindUserById, typeof FindUserByIdSchema, CustomerPresenter>) {
    super(config)
  }
}
