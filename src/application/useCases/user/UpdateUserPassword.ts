import { User } from '../../../domain/User'
import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import CryptoDriver from '../../../infra/drivers/hash/CryptoDriver'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type UpdateUserPasswordInput = {
  userId: string
  password: string
}

type Output = User | BaseError

export default class UpdateUserPassword implements IUseCase<UpdateUserPasswordInput, Output> {
  constructor(
    private _cryptoDriver: CryptoDriver,
    private _userRepository: IUserRepository,
    private _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: UpdateUserPasswordInput): Promise<Output> {
    const { userId: user_id, password } = input
    const user = await this._userRepository.findOne({ user_id })

    // if (!user || (user && !user.isCustomer))
    if (!user)
      return new NotFoundError('User not found')

    user.password = this._cryptoDriver.hashString(password)

    await this._refreshTokenRepository.delete({ user_id })

    return this._userRepository.save(user)
  }
}
