import { User } from '../../../domain/User'
import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import BaseError from '../../BaseError'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type UpdateUserInput = {
  user?: User
  userId: string
  email?: string
}

type Output = User | BaseError

export default class UpdateUser implements IUseCase<UpdateUserInput, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: UpdateUserInput): Promise<Output> {
    const { user, userId: user_id, ...userInput } = input
    const userById = await this._userRepository.findOne({ user_id })

    // if (!user || (user && !user.isCustomer))
    if (!userById)
      return new NotFoundError('User not found')

    Object.keys(userInput).forEach(key => {
      userById[key] = userInput[key]
    })

    await this._refreshTokenRepository.delete({ user_id })

    return this._userRepository.save(userById)
  }
}
