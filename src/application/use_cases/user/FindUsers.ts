import { LevelEnum, User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import NotFoundError from '../../errors/NotFoundError'

export type FindUsersUseCase = UseCase<any, User[]>

export class FindUsers implements FindUsersUseCase {
  constructor(private _userRepository: UserRepository) {}

  async exec(input: any): Promise<User[]> {
    // input.level = LevelEnum.CUSTOMER

    const users = await this._userRepository.find(input)

    if (users.length <= 0)
      throw new NotFoundError('Users not found')

    return users
  }
}
