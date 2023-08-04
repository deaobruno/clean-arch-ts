import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IHashDriver from '../../../infra/drivers/hash/IHashDriver'
import BaseError from '../../BaseError'
import IUseCase from '../../IUseCase'
import ConflictError from '../../errors/ConflictError'

type CreateAdminInput = {
  email: string
  password: string
}

type Output = User | BaseError

export default class CreateAdmin implements IUseCase<CreateAdminInput, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _cryptoDriver: IHashDriver,
  ) {}

  async exec(input: CreateAdminInput): Promise<Output> {
    const { email, password } = input
    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail && userByEmail.email === email)
      return new ConflictError('Email already in use')

    const user = User.create({
      user_id: this._cryptoDriver.generateID(),
      email,
      password: this._cryptoDriver.hashString(password),
      level: 1,
    })

    await this._userRepository.save(user)

    return user
  }
}
