import BaseController from '../BaseController'
import DeleteUser from '../../../application/use_cases/user/DeleteUser'
import ISchema from '../../../infra/schemas/ISchema'

export default class DeleteUserController extends BaseController {
  constructor(useCase: DeleteUser, payloadSchema: ISchema) {
    super({ useCase, payloadSchema })
  }
}
