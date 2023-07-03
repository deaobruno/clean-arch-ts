import ISchema from '../../../infra/schemas/ISchema'
import IUseCase from '../../IUseCase'
import BadRequestError from '../../errors/BadRequestError'

export default class ValidateInput implements IUseCase<any, void | Error> {
  constructor(private schema: ISchema) {}

  exec(payload: any) {
    const error = this.schema.validate(payload)

    if (error)
      throw new BadRequestError(error.message)
  }
}
