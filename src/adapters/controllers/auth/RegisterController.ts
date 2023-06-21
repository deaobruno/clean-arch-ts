import BaseController from '../BaseController'
import { Register } from '../../../application/use_cases/auth/Register'
import RegisterSchema from '../../../infra/schemas/auth/RegisterSchema'

export default class RegisterController extends BaseController {
  constructor(useCase: Register, inputSchema: typeof RegisterSchema) {
    super({ useCase, inputSchema })
  }
}
