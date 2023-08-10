import { RefreshToken } from '../../../domain/RefreshToken'
import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
import ITokenDriver from '../../../infra/drivers/token/ITokenDriver'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'
import UnauthorizedError from '../../errors/UnauthorizedError'

type Input = {
  refreshToken: string
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
    const { refreshToken: token } = payload
    const previousToken = await this._refreshTokenRepository.findOneByToken(token)
    let userData

    if (!previousToken)
      return new UnauthorizedError('Refresh token not found')

    try {
      userData = this._tokenDriver.validateRefreshToken(token)
    } catch (error: any) {
      if (error.name === 'TokenExpiredError')
        return new UnauthorizedError('Refresh token expired')

      return new UnauthorizedError('Invalid refresh token')
    }

    const { userId } = previousToken

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
