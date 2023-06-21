import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

export type FindUsersInput = {
  email?: string
}

export class FindUsers implements IUseCase<FindUsersInput, User[]> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input?: FindUsersInput): Promise<User[]> {
    // input.level = LevelEnum.CUSTOMER

    const users = await this._userRepository.find(input)

    if (users.length <= 0)
      throw new NotFoundError('Users not found')

    return users
  }
}
