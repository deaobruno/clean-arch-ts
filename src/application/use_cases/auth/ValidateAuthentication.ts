import { User } from '../../../domain/User'
import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
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
  constructor(
    private _tokenDriver: JwtDriver,
    private _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { authorization } = input

    if (!authorization)
      return new UnauthorizedError('No token provided')

    const [type, token] = authorization.split(' ')

    if (type !== 'Bearer')
      return new UnauthorizedError('Invalid authentication type')

    if (!token)
      return new UnauthorizedError('No token provided')

    let userData

    try {
      userData = <any>this._tokenDriver.validateAccessToken(token)
    } catch (error: any) {
      if (error.name === 'TokenExpiredError')
        return new UnauthorizedError('Token expired')

      return new UnauthorizedError('Invalid token')
    }

    const { id: user_id, email, password, level } = userData
    const refreshToken = await this._refreshTokenRepository.findOne({ user_id })

    if (!refreshToken)
      return new UnauthorizedError('Not authenticated user')

    const user = User.create({
      user_id,
      email,
      password,
      level
    })

    return { user }
  }
}
