import BaseController from '../BaseController'
import RegisterUser from '../../../application/use_cases/auth/RegisterUser'

export default class RegisterUserController extends BaseController {
  constructor(useCase: RegisterUser) {
    super(useCase)
  }
}
