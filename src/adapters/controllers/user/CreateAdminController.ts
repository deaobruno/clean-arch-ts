import BaseController from '../BaseController'
import CreateAdmin from '../../../application/useCases/user/CreateAdmin'
import CreateAdminSchema from '../../../infra/schemas/user/CreateAdminSchema'

export default class CreateAdminController extends BaseController {
  constructor(useCase: CreateAdmin, schema: typeof CreateAdminSchema) {
    super(useCase, schema)
  }
}
