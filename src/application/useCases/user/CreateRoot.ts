import { LevelEnum, User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import IHashDriver from '../../../infra/drivers/hash/IHashDriver'
import BaseError from '../../errors/BaseError'
import IUseCase from '../IUseCase'

type CreateRootInput = {
  email: string
  password: string
}

type Output = void | BaseError

export default class CreateRoot implements IUseCase<CreateRootInput, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _cryptoDriver: IHashDriver,
  ) {}

  async exec(input: CreateRootInput): Promise<Output> {
    const { email, password } = input
    const userByEmail = await this._userRepository.findOneByEmail(email)

    if (!userByEmail) {
      const user = User.create({
        userId: this._cryptoDriver.generateID(),
        email,
        password: this._cryptoDriver.hashString(password),
        level: LevelEnum.ROOT,
      })
      
      await this._userRepository.save(user)
    }
  }
}
