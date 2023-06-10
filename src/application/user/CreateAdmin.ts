import { User } from '../../domain/User'
import UserRepository from '../../domain/repositories/UserRepository'

export default class CreateAdmin {
  constructor(private _userRepository: UserRepository) {}

  async exec(input: any): Promise<User> {
    const { email, password, confirm_password } = input

    if (password !== confirm_password) throw new Error('Passwords mismatching')

    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail instanceof User) throw new Error('Email already in use')

    input.level = 0

    const user = User.create(input)

    await this._userRepository.save(user)

    return user
  }
}
