import Controller from '../Controller'
import FindUsers from '../../../application/use_cases/user/FindUsers'
import FindUsersSchema from '../../../infra/schemas/user/FindUsersSchema'

export default class FindUsersController extends Controller {
  constructor(useCase: FindUsers, inputSchema: typeof FindUsersSchema) {
    super({ useCase, inputSchema })
  }
}
