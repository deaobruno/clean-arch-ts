import IUserRepository from '../../../domain/repositories/IUserRepository'
import BaseError from '../../BaseError'
import IUseCase from '../../IUseCase'
import NotFoundError from '../../errors/NotFoundError'

type Input = {
  userId: string
}

type Output = void | BaseError

export default class DeleteUser implements IUseCase<Input, Output> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: Input): Promise<Output> {
    const { userId: user_id } = input

    if (!await this._userRepository.findOne({ user_id }))
      return new NotFoundError('User not found')

    await this._userRepository.delete({ user_id })
  }
}
