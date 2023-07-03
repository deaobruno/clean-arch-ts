import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type UpdateUserPasswordInput = {
  userId: string
  password: string
  confirm_password: string
}

export default class UpdateUserPassword implements IUseCase<UpdateUserPasswordInput, User> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: UpdateUserPasswordInput): Promise<User> {
    const { userId, password } = input
    const user = await this._userRepository.findOne({ user_id: userId })

    // if (!user || (user && !user.isCustomer))
    if (!user)
      throw new NotFoundError('User not found')

    user.password = password

    return this._userRepository.save(user)
  }
}
