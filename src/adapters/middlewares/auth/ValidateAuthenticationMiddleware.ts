import ValidateAuthentication from '../../../application/useCases/auth/ValidateAuthentication'
import BaseMiddleware from '../BaseMiddleware'

export default class ValidateAuthenticationMiddleware extends BaseMiddleware {
  constructor(useCase: ValidateAuthentication) {
    super(useCase)
  }

  formatInput = (payload: any, headers: any) => headers
}
