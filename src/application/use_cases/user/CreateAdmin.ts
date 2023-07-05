import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import CryptoDriver from '../../../infra/drivers/CryptoDriver'
import IUseCase from '../../IUseCase'
import ConflictError from '../../errors/ConflictError'

type CreateAdminInput = {
  email: string
  password: string
}

export default class CreateAdmin implements IUseCase<CreateAdminInput, User> {
  constructor(private _userRepository: IUserRepository, private _cryptoDriver: CryptoDriver) {}

  async exec(input: CreateAdminInput): Promise<User> {
    const { email, password } = input

    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail instanceof User)
      throw new ConflictError('Email already in use')

    const user = User.create({ user_id: this._cryptoDriver.generateID(), email, password, level: 1 })

    await this._userRepository.save(user)

    return user
  }
}
