import IUserRepository from '../../../domain/repositories/IUserRepository'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type Input = {
  userId: string
}

export default class DeleteUser implements IUseCase<Input, void> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: Input): Promise<void> {
    const { userId: user_id } = input

    if (!await this._userRepository.findOne({ user_id }))
      throw new NotFoundError('User not found')

    await this._userRepository.delete({ user_id })
  }
}
