import BaseController from '../BaseController'
import DeleteRefreshToken from '../../../application/useCases/auth/DeleteRefreshToken'
import LogoutSchema from '../../../infra/schemas/auth/LogoutSchema'

export default class LogoutController extends BaseController {
  constructor(useCase: DeleteRefreshToken, schema: typeof LogoutSchema) {
    super(useCase, schema)
  }
}
