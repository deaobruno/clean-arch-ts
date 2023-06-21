import BaseController from '../BaseController'
import { CreateAdmin } from '../../../application/use_cases/user/CreateAdmin'
import CreateAdminSchema from '../../../infra/schemas/user/CreateAdminSchema'

export default class CreateAdminController extends BaseController {
  constructor(useCase: CreateAdmin, inputSchema: typeof CreateAdminSchema) {
    super({ useCase, inputSchema })
  }
}
