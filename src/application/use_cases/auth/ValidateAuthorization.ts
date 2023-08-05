import { User } from '../../../domain/User'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'
import ForbiddenError from '../../errors/ForbiddenError'

type Input = {
  user: User
}

type Output = void | BaseError

export default class ValidateAuthorization implements IUseCase<Input, Output> {
  exec(input: Input): Output {
    if (input.user.isCustomer)
      return new ForbiddenError()
  }
}
