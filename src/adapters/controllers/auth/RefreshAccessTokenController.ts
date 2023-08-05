import BaseController from '../BaseController'
import RefreshAccessToken from '../../../application/useCases/auth/RefreshAccessToken'

export default class RefreshAccessTokenController extends BaseController {
  constructor(useCase: RefreshAccessToken) {
    super(useCase)
  }
}
