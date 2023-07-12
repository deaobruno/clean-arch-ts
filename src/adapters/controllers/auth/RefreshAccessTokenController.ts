import BaseController from '../BaseController'
import RefreshAccessToken from '../../../application/use_cases/auth/RefreshAccessToken'

export default class RefreshAccessTokenController extends BaseController {
  constructor(useCase: RefreshAccessToken) {
    super(useCase)
  }
}
