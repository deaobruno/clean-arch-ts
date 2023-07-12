import RefreshToken from '../../../domain/RefreshToken'
import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
import JwtDriver from '../../../infra/drivers/JwtDriver'
import BaseError from '../../BaseError'
import IUseCase from '../../IUseCase'
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
    private _tokenDriver: JwtDriver,
    private _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(payload: Input) {
    const { refreshToken: token } = payload
    const previousToken = await this._refreshTokenRepository.findOne({ token })
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

    const { user_id } = previousToken

    await this._refreshTokenRepository.delete({ user_id })

    const accessToken = this._tokenDriver.generateAccessToken(userData)
    const refreshToken = this._tokenDriver.generateRefreshToken(userData)
    const refreshTokenEntity = RefreshToken.create({ user_id, token: refreshToken })

    await this._refreshTokenRepository.save(refreshTokenEntity)

    return {
      accessToken,
      refreshToken,
    }
  }
}
