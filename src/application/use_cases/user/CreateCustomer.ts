import { User } from '../../../domain/User'
import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import ConflictError from '../../errors/ConflictError'

type Input = {
  email: string
  password: string
}

export default class CreateCustomer implements UseCase<Input, User> {
  constructor(private _userRepository: UserRepository) {}

  async exec(input: Input): Promise<User> {
    const { email } = input

    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail instanceof User)
      throw new ConflictError('Email already in use')

    const user = User.create({ ...input, level: 2 })

    await this._userRepository.save(user)

    return user
  }
}
