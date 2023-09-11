import BadRequestError from '../../application/errors/BadRequestError'
import IUseCase from '../../application/useCases/IUseCase'
import ValidateAuthentication from '../../application/useCases/auth/ValidateAuthentication'
import ValidateAuthorization from '../../application/useCases/auth/ValidateAuthorization'
import ISchema from '../../infra/schemas/ISchema'
import ControllerConfig from './ControllerConfig'

export default abstract class BaseController {
  protected authenticate = false
  protected authorize = false
  private _useCase: IUseCase<any, any>
  private _validateAuthenticationUseCase?: ValidateAuthentication
  private _validateAuthorizationUseCase?: ValidateAuthorization
  private _schema?: ISchema

  constructor(config: ControllerConfig) {
    this._useCase = config.useCase
    this._validateAuthenticationUseCase = config.validateAuthenticationUseCase
    this._validateAuthorizationUseCase = config.validateAuthorizationUseCase
    this._schema = config.schema
  }

  async handle(headers: any, payload: any): Promise<any> {
    const { authorization } = headers

    if (this.authenticate) {
      const authentication = await this._validateAuthenticationUseCase?.exec({ authorization })

      if (authentication instanceof Error)
        return authentication

      if (authentication && this.authorize) {
        const { user } = authentication
        const authorization = this._validateAuthorizationUseCase?.exec({ user })

        if (authorization instanceof Error)
          return authorization
      }
    }

    const error = this._schema?.validate(payload)

    if (error)
      return new BadRequestError(error.message)

    return this._useCase.exec(payload)
  }
}
