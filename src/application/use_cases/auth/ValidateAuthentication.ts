import JwtDriver from '../../../infra/drivers/JwtDriver'
import IUseCase from '../../IUseCase'
import UnauthorizedError from '../../errors/UnauthorizedError'

type Input = {
  authorization: string
}

type Output = {
  user: {
    email: string
    password: string
  }
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
      return { user: <any>this._tokenDriver.validate(token) }
    } catch (error) {
      throw new UnauthorizedError()
    }
  }
}
