import { User } from '../../../domain/User'
import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type UpdateUserInput = {
  user: User
  user_id: string
  email?: string
}

type Output = User | BaseError

export default class UpdateUser implements IUseCase<UpdateUserInput, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: UpdateUserInput): Promise<Output> {
    const { user: requestUser, user_id, ...userInput } = input

    if (requestUser.isCustomer && requestUser.userId !== user_id)
      return new NotFoundError('User not found')

    const user = await this._userRepository.findOne({ user_id })

    if (!user || user.isRoot)
      return new NotFoundError('User not found')

    Object.keys(userInput).forEach(key => {
      user[key] = userInput[key]
    })

    await this._refreshTokenRepository.delete({ user_id })

    return this._userRepository.save(user)
  }
}
