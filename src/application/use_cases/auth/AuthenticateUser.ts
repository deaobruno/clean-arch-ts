import IUserRepository from '../../../domain/repositories/IUserRepository'
import JwtDriver from '../../../infra/drivers/JwtDriver'
import IUseCase from '../../IUseCase'
import UnauthorizedError from '../../errors/UnauthorizedError'

type Input = {
  email: string
  password: string
}

type Output = {
  token: string
}

export default class AuthenticateUser implements IUseCase<Input, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _tokenDriver: JwtDriver,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { email, password } = input
    const user = await this._userRepository.findOneByEmail(email)
    
    if (!user || user.password !== password)
      throw new UnauthorizedError()
  
    const { user_id, level } = user
    const userData = {
      id: user_id,
      email,
      password,
      level,
    }

    return {
      token: this._tokenDriver.generate(userData)
    }
  }
}