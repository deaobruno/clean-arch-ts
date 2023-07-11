import ISchema from '../../../infra/schemas/ISchema'
import BaseError from '../../BaseError'
import IUseCase from '../../IUseCase'
import BadRequestError from '../../errors/BadRequestError'

type Output = void | BaseError

export default class ValidateInput implements IUseCase<any, Output> {
  constructor(private schema: ISchema) {}

  exec(payload: any): Output {
    const error = this.schema.validate(payload)

    if (error)
      return new BadRequestError(error.message)
  }
}
