import IUseCase from '../../application/useCases/IUseCase'
import ISchema from '../../infra/schemas/ISchema'
import IPresenter from '../presenters/IPresenter'
import AuthenticatedController from './AuthenticatedController'
import ControllerConfig from './ControllerConfig'

export default abstract class AuthorizedController extends AuthenticatedController {
  authorize = true

  constructor(config: ControllerConfig<IUseCase<any, any>, ISchema, IPresenter>) {
    super(config)
    
    if (this.authorize && !config.validateAuthorizationUseCase)
      throw Error(`[${ this.constructor.name }] Authorization use case is required`)
  }
}
