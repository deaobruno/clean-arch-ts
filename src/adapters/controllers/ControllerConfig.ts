import IUseCase from '../../application/useCases/IUseCase'
import ValidateAuthentication from '../../application/useCases/auth/ValidateAuthentication'
import ValidateAuthorization from '../../application/useCases/auth/ValidateAuthorization'
import ISchema from '../../infra/schemas/ISchema'
import IPresenter from '../presenters/IPresenter'

type ControllerConfig<T = IUseCase<any, any>, U = ISchema, V = IPresenter> = {
  useCase: T
  validateAuthenticationUseCase?: ValidateAuthentication
  validateAuthorizationUseCase?: ValidateAuthorization
  schema?: U
  presenter?: V
}

export default ControllerConfig
