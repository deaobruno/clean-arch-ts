import BaseController from '../BaseController'
import AuthenticateUser from '../../../application/useCases/auth/AuthenticateUser'
import AuthenticateUserSchema from '../../../infra/schemas/auth/AuthenticateUserSchema'

export default class AuthenticateUserController extends BaseController {
  constructor(useCase: AuthenticateUser, schema: typeof AuthenticateUserSchema) {
    super(useCase, schema)
  }
}
