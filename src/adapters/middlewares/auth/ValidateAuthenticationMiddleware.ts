import ValidateAuthentication from '../../../application/use_cases/auth/ValidateAuthentication'
import BaseMiddleware from '../BaseMiddleware'

export default class ValidateAuthenticationMiddleware extends BaseMiddleware {
  constructor(useCase: ValidateAuthentication) {
    super(useCase)
  }
}
