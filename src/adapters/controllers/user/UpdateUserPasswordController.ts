import AuthenticatedController from '../AuthenticatedController';
import UpdateUserPassword from '../../../application/useCases/user/UpdateUserPassword';
import UpdateUserPasswordSchema from '../../../infra/schemas/user/UpdateUserPasswordSchema';
import ControllerConfig from '../ControllerConfig';
import CustomerPresenter from '../../presenters/user/CustomerPresenter';

export default class UpdateUserPasswordController extends AuthenticatedController {
  statusCode = 200;

  constructor(
    config: ControllerConfig<
      UpdateUserPassword,
      typeof UpdateUserPasswordSchema,
      CustomerPresenter
    >,
  ) {
    super(config);
  }
}
