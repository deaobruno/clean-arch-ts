import BaseController from '../BaseController'
import RefreshAccessToken from '../../../application/useCases/auth/RefreshAccessToken'
import RefreshAccessTokenSchema from '../../../infra/schemas/auth/RefreshAccessTokenSchema'

export default class RefreshAccessTokenController extends BaseController {
  constructor(useCase: RefreshAccessToken, schema: typeof RefreshAccessTokenSchema) {
    super(useCase, schema)
  }
}
