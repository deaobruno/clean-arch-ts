import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import NotFoundError from '../../errors/NotFoundError'

export type FindUserByIdUseCase = UseCase<any, User>

export class FindUserById implements FindUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async exec(input: any): Promise<User> {
    const { userId } = input
    const user = await this.userRepository.findOneById(userId)

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    return user
  } 
}
