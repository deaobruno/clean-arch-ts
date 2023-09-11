import IUseCase from '../../application/useCases/IUseCase'
import ValidateAuthentication from '../../application/useCases/auth/ValidateAuthentication'
import ValidateAuthorization from '../../application/useCases/auth/ValidateAuthorization'
import ISchema from '../../infra/schemas/ISchema'

type ControllerConfig<T = IUseCase<any, any>, U = ISchema> = {
  useCase: T
  validateAuthenticationUseCase?: ValidateAuthentication
  validateAuthorizationUseCase?: ValidateAuthorization
  schema?: U
}

export default ControllerConfig