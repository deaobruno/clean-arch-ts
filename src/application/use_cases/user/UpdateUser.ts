import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

export default class UpdateUser implements IUseCase<any, User> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: any): Promise<User> {
    const { userId, ...userInput } = input
    const filter = { user_id: userId }
    const user = await this._userRepository.findOne(filter)

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    Object.keys(userInput).forEach(key => {
      user[key] = userInput[key]
    })

    return this._userRepository.save(user)
  }
}
