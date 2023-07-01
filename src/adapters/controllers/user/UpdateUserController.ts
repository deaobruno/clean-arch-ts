import BaseController from '../BaseController'
import { UpdateUser } from '../../../application/use_cases/user/UpdateUser'
import ISchema from '../../../infra/schemas/ISchema'

export default class UpdateUserController extends BaseController {
  constructor(useCase: UpdateUser, payloadSchema: ISchema) {
    super({ useCase, payloadSchema })
  }
}
