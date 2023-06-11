import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import ConflictError from '../../errors/ConflictError'

export default class CreateCustomer implements UseCase<any, User> {
  constructor(private _userRepository: UserRepository) {}

  async exec(input: any): Promise<User> {
    const { email } = input

    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail instanceof User)
      throw new ConflictError('Email already in use')

    input.level = 2

    const user = User.create(input)

    await this._userRepository.save(user)

    return user
  }
}
