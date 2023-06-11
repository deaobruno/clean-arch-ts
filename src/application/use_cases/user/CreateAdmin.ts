import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import BadRequestError from '../../errors/BadRequestError'
import ConflictError from '../../errors/ConflictError'

export default class CreateAdmin implements UseCase<any, User> {
  constructor(private _userRepository: UserRepository) {}

  async exec(input: any): Promise<User> {
    const { email, password, confirm_password } = input

    if (password !== confirm_password)
      throw new BadRequestError('Passwords mismatch')

    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail instanceof User)
      throw new ConflictError('Email already in use')

    input.level = 1

    const user = User.create(input)

    await this._userRepository.save(user)

    return user
  }
}
