import { User } from '../../../domain/User'
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
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: UpdateUserInput): Promise<Output> {
    const { user, userId, ...userInput } = input
    const userById = await this._userRepository.findOne({ user_id: userId })

    // if (!user || (user && !user.isCustomer))
    if (!userById)
      return new NotFoundError('User not found')

    Object.keys(userInput).forEach(key => {
      userById[key] = userInput[key]
    })

    return this._userRepository.save(userById)
  }
}
