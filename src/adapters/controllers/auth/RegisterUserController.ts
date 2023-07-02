import BaseController from '../BaseController'
import RegisterUser from '../../../application/use_cases/auth/RegisterUser'
import ISchema from '../../../infra/schemas/ISchema'

export default class RegisterUserController extends BaseController {
  constructor(useCase: RegisterUser, payloadSchema: ISchema) {
    super({ useCase, payloadSchema })
  }
}
