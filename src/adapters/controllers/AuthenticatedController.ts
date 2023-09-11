import IUseCase from '../../application/useCases/IUseCase'
import ISchema from '../../infra/schemas/ISchema'
import BaseController from './BaseController'
import ControllerConfig from './ControllerConfig'

export default class AuthenticatedController extends BaseController {
  authenticate = true

  constructor(config: ControllerConfig<IUseCase<any, any>, ISchema>) {
    super(config)
    
    if (this.authenticate && !config.validateAuthenticationUseCase)
      throw Error(`[${ this.constructor.name }] Authentication use case is required`)
  }
}
