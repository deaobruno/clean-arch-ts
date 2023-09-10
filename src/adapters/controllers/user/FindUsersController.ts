import BaseController from '../BaseController'
import FindUsers from '../../../application/useCases/user/FindUsers'
import FindUsersSchema from '../../../infra/schemas/user/FindUsersSchema'

export default class FindUsersController extends BaseController {
  constructor(useCase: FindUsers, schema: typeof FindUsersSchema) {
    super(useCase, schema)
  }
}
