import BaseController from '../BaseController'
import { FindUsers } from '../../../application/use_cases/user/FindUsers'
import ISchema from '../../../infra/schemas/ISchema'

export default class FindUsersController extends BaseController {
  constructor(useCase: FindUsers, payloadSchema: ISchema) {
    super({ useCase, payloadSchema })
  }
}
