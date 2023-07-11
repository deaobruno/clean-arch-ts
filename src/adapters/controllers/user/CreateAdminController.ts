import BaseController from '../BaseController'
import CreateAdmin from '../../../application/use_cases/user/CreateAdmin'

export default class CreateAdminController extends BaseController {
  constructor(useCase: CreateAdmin) {
    super(useCase)
  }
}
