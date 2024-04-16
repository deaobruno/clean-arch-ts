import AuthenticatedController from '../AuthenticatedController';
import UpdateUser from '../../../application/useCases/user/UpdateUser';
import UpdateUserSchema from '../../../infra/schemas/user/UpdateUserSchema';
import ControllerConfig from '../ControllerConfig';
import CustomerPresenter from '../../presenters/user/CustomerPresenter';

export default class UpdateUserController extends AuthenticatedController {
  statusCode = 200;

  constructor(
    config: ControllerConfig<
      UpdateUser,
      typeof UpdateUserSchema,
      CustomerPresenter
    >,
  ) {
    super(config);
  }
}
