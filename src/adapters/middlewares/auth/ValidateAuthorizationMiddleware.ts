import ValidateAuthorization from '../../../application/use_cases/auth/ValidateAuthorization'
import BaseMiddleware from '../BaseMiddleware'

export default class ValidateAuthorizationMiddleware extends BaseMiddleware {
  constructor(useCase: ValidateAuthorization) {
    super(useCase)
  }

  formatInput = (payload: any, headers: any) => payload
}
