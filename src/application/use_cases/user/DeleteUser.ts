import UserRepository from '../../../domain/repositories/UserRepository'
import UseCase from '../../UseCase'
import NotFoundError from '../../errors/NotFoundError'

type Input = {
  userId: string
}

export default class DeleteUser implements UseCase<Input, void> {
  constructor(private userRepository: UserRepository) {}

  async exec(input: Input): Promise<void> {
    const { userId: user_id } = input

    if (!await this.userRepository.findOne({ user_id }))
      throw new NotFoundError('User not found')

    await this.userRepository.delete({ user_id })
  }
}
