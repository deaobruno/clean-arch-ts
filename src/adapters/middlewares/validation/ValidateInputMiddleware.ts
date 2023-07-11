import ValidateInput from '../../../application/use_cases/validation/ValidateInput'
import BaseMiddleware from '../BaseMiddleware'

export default class ValidateInputMiddleware extends BaseMiddleware {
  constructor(useCase: ValidateInput) {
    super(useCase)
  }

  formatInput = (payload: any, headers: any) => payload
}
