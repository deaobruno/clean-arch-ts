import BaseController from '../BaseController'
import AuthenticateUser from '../../../application/use_cases/auth/AuthenticateUser'
import AuthenticateUserSchema from '../../../infra/schemas/auth/AuthenticateUserSchema'

export default class AuthenticateUserController extends BaseController {
  constructor(useCase: AuthenticateUser, inputSchema: typeof AuthenticateUserSchema) {
    super({ useCase, inputSchema })
  }
}
