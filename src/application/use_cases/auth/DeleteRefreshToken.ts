import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type Input = {
  refreshToken: string
}

type Output = void | BaseError

export default class DeleteRefreshToken implements IUseCase<Input, Output> {
  constructor(private _refreshTokenRepository: IRefreshTokenRepository) {}

  async exec(payload: Input): Promise<Output> {
    const refreshToken = await this._refreshTokenRepository.findOne({ token: payload.refreshToken })

    if (!refreshToken)
      return new NotFoundError('Refresh token not found')

    await this._refreshTokenRepository.delete({ token: refreshToken.token })
  }
}
