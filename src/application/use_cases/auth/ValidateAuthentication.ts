import { User } from '../../../domain/User'
import JwtDriver from '../../../infra/drivers/JwtDriver'
import BaseError from '../../BaseError'
import IUseCase from '../../IUseCase'
import UnauthorizedError from '../../errors/UnauthorizedError'

type Input = {
  authorization: string
}

type Output = {
  user: User
} | BaseError

export default class ValidateAuthentication implements IUseCase<Input, Output> {
  constructor(private _tokenDriver: JwtDriver) {}

  exec(input: Input): Output {
    const { authorization } = input

    if (!authorization)
      return new UnauthorizedError('No token provided')

    const [type, token] = authorization.split(' ')

    if (type !== 'Bearer')
      return new UnauthorizedError('Invalid authentication type')

    if (!token)
      return new UnauthorizedError('No token provided')

    try {
      const { id, email, password, level } = <any>this._tokenDriver.validateAccessToken(token)
      const user = User.create({
        user_id: id,
        email,
        password,
        level
      })

      return { user }
    } catch (error: any) {
      if (error.name === 'TokenExpiredError')
        return new UnauthorizedError('Token expired')

      return new UnauthorizedError('Invalid token')
    }
  }
}
