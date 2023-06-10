import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import BadRequestError from '../../errors/BadRequestError'
import ConflictError from '../../errors/ConflictError'

export default class CreateCustomer implements UseCase {
  constructor(private _userRepository: UserRepository) {}

  async exec(input: any): Promise<User> {
    const { email, password, confirm_password } = input

    if (password !== confirm_password) throw new BadRequestError('Passwords mismatching')

    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail instanceof User) throw new ConflictError('Email already in use')

    input.level = 2

    const user = User.create(input)

    await this._userRepository.save(user)

    return user
  }
}
