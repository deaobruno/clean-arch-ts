import BaseController from '../BaseController'
import { Register } from '../../../application/use_cases/auth/Register'
import ISchema from '../../../infra/schemas/ISchema'

export default class RegisterController extends BaseController {
  constructor(useCase: Register, payloadSchema: ISchema) {
    super({ useCase, payloadSchema })
  }
}
