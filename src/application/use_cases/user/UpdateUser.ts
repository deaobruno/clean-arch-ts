import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import NotFoundError from '../../errors/NotFoundError'

export type UpdateUserUseCase = UseCase<any, User>

export class UpdateUser implements UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async exec(input: any): Promise<User> {
    const { userId, ...userInput } = input
    const user = await this.userRepository.findOneById(userId)

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    Object.keys(userInput).forEach(key => {
      user[key] = userInput[key]
    })

    return this.userRepository.save(user, userId)
  }
}
