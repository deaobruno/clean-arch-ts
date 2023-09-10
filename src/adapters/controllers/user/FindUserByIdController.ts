import BaseController from '../BaseController'
import FindUserById from '../../../application/useCases/user/FindUserById'
import FindUserByIdSchema from '../../../infra/schemas/user/FindUserByIdSchema'

export default class FindUserByIdController extends BaseController {
  constructor(useCase: FindUserById, schema: typeof FindUserByIdSchema) {
    super(useCase, schema)
  }
}
