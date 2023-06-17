import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import NotFoundError from '../../errors/NotFoundError'

type Input = {
  userId: string
}

export default class FindUserById implements UseCase<Input, User> {
  constructor(private userRepository: UserRepository) {}

  async exec(input: Input): Promise<User> {
    const { userId } = input
    const user = await this.userRepository.findOne({ user_id: userId })

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    return user
  } 
}
