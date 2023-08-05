import BaseController from '../BaseController'
import UpdateUser from '../../../application/useCases/user/UpdateUser'

export default class UpdateUserController extends BaseController {
  constructor(useCase: UpdateUser) {
    super(useCase)
  }
}
