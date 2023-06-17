import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type Input = {
  userId: string
}

export default class FindUserById implements IUseCase<Input, User> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: Input): Promise<User> {
    const { userId } = input
    const user = await this._userRepository.findOne({ user_id: userId })

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    return user
  } 
}
