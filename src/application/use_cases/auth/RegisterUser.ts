import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import CryptoDriver from '../../../infra/drivers/CryptoDriver'
import IUseCase from '../../IUseCase'
import ConflictError from '../../errors/ConflictError'

type RegisterUserInput = {
  email: string
  password: string
  confirm_password: string
}

export default class RegisterUser implements IUseCase<RegisterUserInput, User> {
  constructor(
    private _userRepository: IUserRepository,
    private _cryptoDriver: CryptoDriver,
  ) {}

  async exec(input: RegisterUserInput): Promise<User> {
    const { email } = input

    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail instanceof User)
      throw new ConflictError('Email already in use')

    const user = User.create({ user_id: this._cryptoDriver.generateID(), level: 2, ...input })

    await this._userRepository.save(user)

    return user
  }
}