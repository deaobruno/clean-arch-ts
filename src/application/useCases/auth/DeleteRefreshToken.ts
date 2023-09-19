import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'
import NotFoundError from '../../errors/NotFoundError'
import { User } from '../../../domain/User'
import ForbiddenError from '../../errors/ForbiddenError'

type Input = {
  user: User
  refresh_token: string
}

type Output = void | BaseError

export default class DeleteRefreshToken implements IUseCase<Input, Output> {
  constructor(private _refreshTokenRepository: IRefreshTokenRepository) {}

  async exec(payload: Input): Promise<Output> {
    const { user, refresh_token } = payload
    const refreshToken = await this._refreshTokenRepository.findOneByToken(refresh_token)

    if (!refreshToken)
      return new NotFoundError('Refresh token not found')

    if (user.userId !== refreshToken.userId)
      return new ForbiddenError('Token does not belong to user')

    await this._refreshTokenRepository.delete({ token: refreshToken.token })
  }
}
