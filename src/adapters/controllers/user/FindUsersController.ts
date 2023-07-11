import BaseController from '../BaseController'
import FindUsers from '../../../application/use_cases/user/FindUsers'

export default class FindUsersController extends BaseController {
  constructor(useCase: FindUsers) {
    super(useCase)
  }
}
