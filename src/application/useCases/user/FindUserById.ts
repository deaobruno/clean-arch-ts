import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type Input = {
  user_id: string
}

type Output = User | BaseError

export default class FindUserById implements IUseCase<Input, Output> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: Input): Promise<Output> {
    const { user_id } = input
    const user = await this._userRepository.findOne({ user_id })

    // if (!user || (user && !user.isCustomer))
    if (!user)
      return new NotFoundError('User not found')

    return user
  } 
}
