import BaseController from '../BaseController'
import FindUsers from '../../../application/useCases/user/FindUsers'

export default class FindUsersController extends BaseController {
  constructor(useCase: FindUsers) {
    super(useCase)
  }
}
