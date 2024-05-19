import IUseCase from '../../application/useCases/IUseCase';
import ValidateAuthentication from '../../application/useCases/auth/ValidateAuthentication';
import ValidateAuthorization from '../../application/useCases/auth/ValidateAuthorization';
import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';
import ISchema from '../../infra/schemas/ISchema';
import IPresenter from '../presenters/IPresenter';

type ControllerConfig<
  T = IUseCase<unknown, unknown>,
  U = ISchema,
  V = IPresenter,
> = {
  logger: ILoggerDriver;
  useCase: T;
  validateAuthenticationUseCase?: ValidateAuthentication;
  validateAuthorizationUseCase?: ValidateAuthorization;
  schema?: U;
  presenter?: V;
};

export default ControllerConfig;
