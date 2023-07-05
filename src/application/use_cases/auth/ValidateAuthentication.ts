import { User } from '../../../domain/User'
import JwtDriver from '../../../infra/drivers/JwtDriver'
import IUseCase from '../../IUseCase'
import UnauthorizedError from '../../errors/UnauthorizedError'

type Input = {
  authorization: string
}

type Output = {
  user: User
}

type IValidateAuthentication = IUseCase<Input, Output>

export default class ValidateAuthentication implements IValidateAuthentication {
  constructor(private _tokenDriver: JwtDriver) {}

  async exec(input: Input): Promise<Output> {
    const { authorization } = input

    if (!authorization)
      throw new UnauthorizedError('No token provided')

    const [type, token] = authorization.split(' ')

    if (!token)
      throw new UnauthorizedError('No token provided')

    if (type !== 'Bearer')
      throw new UnauthorizedError('Invalid authorization type')

    try {
      const { id, email, password, level } = <any>this._tokenDriver.validate(token)
      const user = User.create({
        user_id: id,
        email,
        password,
        level
      })

      return { user }
    } catch (error: any) {
      if (error.name === 'TokenExpiredError')
        throw new UnauthorizedError('Token expired')

      throw new UnauthorizedError('Invalid token')
    }
  }
}
