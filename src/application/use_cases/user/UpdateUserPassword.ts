import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import NotFoundError from '../../errors/NotFoundError'

export default class UpdateUserPassword implements UseCase<any, User> {
  constructor(private userRepository: UserRepository) {}

  async exec(input: any): Promise<User> {
    const { userId, password } = input
    const user = await this.userRepository.findOneById(userId)

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    user.password = password

    return this.userRepository.save(user, userId)
  }
}
