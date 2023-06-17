import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import NotFoundError from '../../errors/NotFoundError'

type Input = {
  userId: string
  password: string
}

export default class UpdateUserPassword implements UseCase<Input, User> {
  constructor(private userRepository: UserRepository) {}

  async exec(input: Input): Promise<User> {
    const { userId, password } = input
    const user = await this.userRepository.findOne({ user_id: userId })

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    user.password = password

    return this.userRepository.save(user)
  }
}
