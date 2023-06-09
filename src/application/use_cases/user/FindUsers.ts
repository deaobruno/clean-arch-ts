import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import BaseError from '../../BaseError'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type FindUsersInput = {
  user?: User
  email?: string
}

type Output = User[] | BaseError

export default class FindUsers implements IUseCase<FindUsersInput, Output> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: FindUsersInput): Promise<Output> {
    const { user, ...filters } = input
    // input.level = LevelEnum.CUSTOMER

    const users = await this._userRepository.find(filters)

    if (!users || users.length <= 0)
      return new NotFoundError('Users not found')

    return users
  }
}
