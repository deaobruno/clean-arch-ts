import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import CryptoDriver from '../../../infra/drivers/hash/CryptoDriver'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'
import ConflictError from '../../errors/ConflictError'

type RegisterCustomerInput = {
  email: string
  password: string
  confirm_password: string
}

type Output = User | BaseError

export default class RegisterCustomer implements IUseCase<RegisterCustomerInput, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _cryptoDriver: CryptoDriver,
  ) {}

  async exec(input: RegisterCustomerInput): Promise<Output> {
    const { email, password } = input
    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (userByEmail && userByEmail.email === email)
      return new ConflictError('Email already in use')

    const user = User.create({
      userId: this._cryptoDriver.generateID(),
      email,
      password: this._cryptoDriver.hashString(password),
      level: 2,
    })

    await this._userRepository.save(user)

    return user
  }
}
