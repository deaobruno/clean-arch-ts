import { RefreshToken } from '../../../domain/RefreshToken'
import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
import ITokenDriver from '../../../infra/drivers/token/ITokenDriver'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'
import { User } from '../../../domain/User'
import ForbiddenError from '../../errors/ForbiddenError'

type Input = {
  user: User
  refresh_token: string
}

type Output = {
  accessToken: string
  refreshToken: string
} | BaseError

export default class RefreshAccessToken implements IUseCase<Input, Output> {
  constructor(
    private _tokenDriver: ITokenDriver,
    private _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(payload: Input) {
    const { user, refresh_token } = payload
    const previousToken = await this._refreshTokenRepository.findOneByToken(refresh_token)
    let userData

    if (!previousToken)
      return new ForbiddenError('Refresh token not found')

    const { userId } = previousToken

    if (user.userId !== userId)
      return new ForbiddenError('Token does not belong to user')

    try {
      userData = this._tokenDriver.validateRefreshToken(refresh_token)
    } catch (error: any) {
      if (error.name === 'TokenExpiredError')
        return new ForbiddenError('Refresh token expired')

      return new ForbiddenError('Invalid refresh token')
    }

    await this._refreshTokenRepository.delete({ user_id: userId })

    const accessToken = this._tokenDriver.generateAccessToken(userData)
    const refreshToken = this._tokenDriver.generateRefreshToken(userData)
    const refreshTokenEntity = RefreshToken.create({ userId, token: refreshToken })

    await this._refreshTokenRepository.save(refreshTokenEntity)

    return {
      accessToken,
      refreshToken,
    }
  }
}
