import BaseController from '../BaseController'
import { UpdateUserPassword } from '../../../application/use_cases/user/UpdateUserPassword'
import ISchema from '../../../infra/schemas/ISchema'

export default class UpdateUserPasswordController extends BaseController {
  constructor(useCase: UpdateUserPassword, payloadSchema: ISchema) {
    super({ useCase, payloadSchema })
  }
}
