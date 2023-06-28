import FindUserById from '../../../application/use_cases/user/FindUserById'
import FindUserByIdSchema from '../../../infra/schemas/user/FindUserByIdSchema'
import BaseController from '../BaseController'

export default class FindUserByIdController extends BaseController {
  constructor(useCase: FindUserById, inputSchema: typeof FindUserByIdSchema) {
    super({ useCase, inputSchema })
  }
}
