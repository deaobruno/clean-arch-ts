import BaseController from '../BaseController'
import Login from '../../../application/useCases/auth/Login'
import LoginSchema from '../../../infra/schemas/auth/LoginSchema'
import ControllerConfig from '../ControllerConfig'

export default class LoginController extends BaseController {
  statusCode = 200

  constructor(config: ControllerConfig<Login, typeof LoginSchema>) {
    super(config)
  }
}
