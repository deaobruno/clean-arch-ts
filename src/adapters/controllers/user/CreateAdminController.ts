import BaseController from '../BaseController'
import { CreateAdmin } from '../../../application/use_cases/user/CreateAdmin'
import ISchema from '../../../infra/schemas/ISchema'

export default class CreateAdminController extends BaseController {
  constructor(useCase: CreateAdmin, payloadSchema: ISchema) {
    super({ useCase, payloadSchema })
  }
}
