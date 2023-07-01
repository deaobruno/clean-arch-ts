import FindUserById from '../../../application/use_cases/user/FindUserById'
import ISchema from '../../../infra/schemas/ISchema'
import BaseController from '../BaseController'

export default class FindUserByIdController extends BaseController {
  constructor(useCase: FindUserById, payloadSchema: ISchema) {
    super({ useCase, payloadSchema })
  }
}
