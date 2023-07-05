import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type UpdateUserInput = {
  user?: User
  userId: string
  email?: string
}

export default class UpdateUser implements IUseCase<UpdateUserInput, User> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: UpdateUserInput): Promise<User> {
    const { user, userId, ...userInput } = input
    const userById = await this._userRepository.findOne({ user_id: userId })

    // if (!user || (user && !user.isCustomer))
    if (!userById)
      throw new NotFoundError('User not found')

    Object.keys(userInput).forEach(key => {
      userById[key] = userInput[key]
    })

    return this._userRepository.save(userById)
  }
}
