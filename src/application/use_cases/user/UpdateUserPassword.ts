import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import BaseError from '../../BaseError'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type UpdateUserPasswordInput = {
  userId: string
  password: string
}

type Output = User | BaseError

export default class UpdateUserPassword implements IUseCase<UpdateUserPasswordInput, Output> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: UpdateUserPasswordInput): Promise<Output> {
    const { userId, password } = input
    const user = await this._userRepository.findOne({ user_id: userId })

    // if (!user || (user && !user.isCustomer))
    if (!user)
      return new NotFoundError('User not found')

    user.password = password

    return this._userRepository.save(user)
  }
}
