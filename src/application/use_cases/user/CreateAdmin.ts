import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import ConflictError from '../../errors/ConflictError'

type Input = {
  email: string
  password: string
}

export default class CreateAdmin implements IUseCase<Input, User> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: Input): Promise<User> {
    const { email } = input

    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail instanceof User)
      throw new ConflictError('Email already in use')

    const user = User.create({ ...input, level: 1 })

    await this._userRepository.save(user)

    return user
  }
}
