import User from '../../../domain/user/User';
import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import IUserRepository from '../../../domain/user/IUserRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import ConflictError from '../../errors/ConflictError';

type UpdateUserInput = {
  user: User;
  user_id: string;
  email?: string;
};

type Output = User | BaseError;

export default class UpdateUser implements IUseCase<UpdateUserInput, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: UpdateUserInput): Promise<Output> {
    const { user: requestUser, user_id, ...userInput } = input;
    const { email } = userInput;

    if (requestUser.isCustomer && requestUser.userId !== user_id)
      return new NotFoundError('User not found');

    const user = await this._userRepository.findOneById(user_id);

    if (!user || user.isRoot) return new NotFoundError('User not found');

    if (email) {
      const userByEmail = await this._userRepository.findOneByEmail(email);

      if (userByEmail instanceof User && user.userId !== userByEmail.userId)
        return new ConflictError('Email already in use');
    }

    const updatedUser = User.create({
      userId: user.userId,
      email: email ?? user.email,
      password: user.password,
      role: user.role,
    });

    await this._userRepository.update(updatedUser);
    await this._refreshTokenRepository.deleteAllByUser(updatedUser);

    return updatedUser;
  }
}
