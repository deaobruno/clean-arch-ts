import BaseController from '../BaseController'
import AuthenticateUser from '../../../application/use_cases/auth/AuthenticateUser'
import ISchema from '../../../infra/schemas/ISchema'

export default class AuthenticateUserController extends BaseController {
  constructor(useCase: AuthenticateUser, payloadSchema: ISchema) {
    super({ useCase, payloadSchema })
  }
}
