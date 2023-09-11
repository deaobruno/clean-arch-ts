import IUseCase from '../../application/useCases/IUseCase'
import ISchema from '../../infra/schemas/ISchema'
import AuthenticatedController from './AuthenticatedController'
import ControllerConfig from './ControllerConfig'

export default class AuthorizedController extends AuthenticatedController {
  authorize = true

  constructor(config: ControllerConfig<IUseCase<any, any>, ISchema>) {
    super(config)
    
    if (this.authorize && !config.validateAuthorizationUseCase)
      throw Error(`[${ this.constructor.name }] Authorization use case is required`)
  }
}
