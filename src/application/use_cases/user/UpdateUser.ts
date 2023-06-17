import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import NotFoundError from '../../errors/NotFoundError'

export default class UpdateUser implements UseCase<any, User> {
  constructor(private userRepository: UserRepository) {}

  async exec(input: any): Promise<User> {
    const { userId, ...userInput } = input
    const filter = { user_id: userId }
    const user = await this.userRepository.findOne(filter)

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    Object.keys(userInput).forEach(key => {
      user[key] = userInput[key]
    })

    return await this.userRepository.save(user)
  }
}
