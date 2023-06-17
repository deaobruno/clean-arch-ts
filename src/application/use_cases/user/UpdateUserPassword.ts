import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type Input = {
  userId: string
  password: string
}

export default class UpdateUserPassword implements IUseCase<Input, User> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: Input): Promise<User> {
    const { userId, password } = input
    const user = await this._userRepository.findOne({ user_id: userId })

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    user.password = password

    return this._userRepository.save(user)
  }
}
