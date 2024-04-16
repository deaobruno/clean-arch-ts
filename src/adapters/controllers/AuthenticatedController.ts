import IUseCase from '../../application/useCases/IUseCase';
import ISchema from '../../infra/schemas/ISchema';
import IPresenter from '../presenters/IPresenter';
import BaseController from './BaseController';
import ControllerConfig from './ControllerConfig';

export default abstract class AuthenticatedController extends BaseController {
  authenticate = true;

  constructor(
    config: ControllerConfig<IUseCase<unknown, unknown>, ISchema, IPresenter>,
  ) {
    super(config);

    if (this.authenticate && !config.validateAuthenticationUseCase)
      throw Error(
        `[${this.constructor.name}] Authentication use case is required`,
      );
  }
}
