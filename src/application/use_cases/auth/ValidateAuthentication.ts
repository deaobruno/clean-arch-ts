import JwtDriver from '../../../infra/drivers/JwtDriver'
import IUseCase from '../../IUseCase'
import UnauthorizedError from '../../errors/UnauthorizedError'

type Headers = {
  authorization: string
}

type Output = {
  user: {
    email: string
    password: string
  }
}

type IValidateAuthentication = IUseCase<Headers, Output>

export default class ValidateAuthentication implements IValidateAuthentication {
  constructor(private _tokenDriver: JwtDriver) {}

  async exec(input: any, headers: Headers): Promise<Output> {
    const { authorization } = headers

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
