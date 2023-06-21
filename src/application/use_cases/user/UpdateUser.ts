import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

export type UpdateUserInput = {
  userId: string
  email?: string
}

export class UpdateUser implements IUseCase<UpdateUserInput, User> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: UpdateUserInput): Promise<User> {
    const { userId, ...userInput } = input
    const user = await this._userRepository.findOne({ user_id: userId })

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    Object.keys(userInput).forEach(key => {
      user[key] = userInput[key]
    })

    return this._userRepository.save(user)
  }
}
