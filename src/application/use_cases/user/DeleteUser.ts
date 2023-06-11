import UserRepository from '../../../domain/repositories/UserRepository';
import UseCase from '../../UseCase'
import NotFoundError from '../../errors/NotFoundError';

export default class DeleteUser implements UseCase<any, void> {
  constructor(private userRepository: UserRepository) {}

  async exec(input: any): Promise<void> {
    const { userId } = input

    if (!await this.userRepository.exists(userId))
      throw new NotFoundError('User not found')

    await this.userRepository.delete({ user_id: userId })
  }
}
