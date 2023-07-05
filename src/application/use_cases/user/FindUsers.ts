import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type FindUsersInput = {
  user: User
  email?: string
}

export default class FindUsers implements IUseCase<FindUsersInput, User[]> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: FindUsersInput): Promise<User[]> {
    const { user, ...filters } = input
    // input.level = LevelEnum.CUSTOMER

    const users = await this._userRepository.find(filters)

    if (users.length <= 0)
      throw new NotFoundError('Users not found')

    return users
  }
}
