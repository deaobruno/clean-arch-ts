import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import UpdateUserPassword from '../../../../../src/application/useCases/user/UpdateUserPassword';
import NotFoundError from '../../../../../src/application/errors/NotFoundError';
import BaseError from '../../../../../src/application/errors/BaseError';
import UserRepository from '../../../../../src/adapters/repositories/UserRepository';
import RefreshTokenRepository from '../../../../../src/adapters/repositories/RefreshTokenRepository';
import BcryptDriver from '../../../../../src/infra/drivers/encryption/BcryptDriver';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';
import InternalServerError from '../../../../../src/application/errors/InternalServerError';

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = <User>User.create({
  userId,
  email,
  password,
  role: UserRole.CUSTOMER,
});

describe('/application/useCases/user/UpdateUserPassword.ts', () => {
  afterEach(() => sandbox.restore());

  it('should update the password of an existing user', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const bcryptDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUserPassword = new UpdateUserPassword(
      loggerDriver,
      bcryptDriver,
      userRepository,
      refreshTokenRepository,
    );

    bcryptDriver.encrypt.resolves('hash');
    userRepository.findOneById.resolves(fakeUser);

    const newPassword = faker.internet.password();

    fakeUser.password = await bcryptDriver.encrypt(newPassword);

    userRepository.update.resolves();
    refreshTokenRepository.deleteAllByUser.resolves();

    const updateData = {
      user_id: userId,
      password: faker.internet.password(),
    };

    const user = <User>(
      await updateUserPassword.exec({ user: fakeUser, ...updateData })
    );

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(fakeUser.email);
    expect(user.password).equal(fakeUser.password);
    expect(user.role).equal(fakeUser.role);
    expect(user.isCustomer).equal(true);
    expect(user.isRoot).equal(false);
  });

  it('should return same user when input password is empty', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const bcryptDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUserPassword = new UpdateUserPassword(
      loggerDriver,
      bcryptDriver,
      userRepository,
      refreshTokenRepository,
    );

    bcryptDriver.encrypt.resolves('hash');
    userRepository.findOneById.resolves(fakeUser);
    userRepository.update.resolves();
    refreshTokenRepository.deleteAllByUser.resolves();

    const updateData = {
      user_id: userId,
      password: '',
    };

    const user = <User>(
      await updateUserPassword.exec({ user: fakeUser, ...updateData })
    );

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(fakeUser.email);
    expect(user.password).equal(fakeUser.password);
    expect(user.role).equal(fakeUser.role);
    expect(user.isCustomer).equal(true);
    expect(user.isRoot).equal(false);
  });

  it('should return a NotFoundError when authenticated user is different from request user', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const bcryptDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUserPassword = new UpdateUserPassword(
      loggerDriver,
      bcryptDriver,
      userRepository,
      refreshTokenRepository,
    );

    const user_id = 'test';
    const error = <BaseError>await updateUserPassword.exec({
      user: fakeUser,
      user_id,
      password: faker.internet.password(),
    });

    expect(error).deep.equal(
      new NotFoundError(`[UpdateUserPassword] User not found: ${user_id}`),
    );
  });

  it('should return a NotFoundError when trying to update an user password passing wrong ID', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const bcryptDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUserPassword = new UpdateUserPassword(
      loggerDriver,
      bcryptDriver,
      userRepository,
      refreshTokenRepository,
    );

    userRepository.findOneById.resolves();

    const error = <BaseError>await updateUserPassword.exec({
      user: fakeUser,
      user_id: userId,
      password: '',
    });

    expect(error).deep.equal(
      new NotFoundError(`[UpdateUserPassword] User not found: ${userId}`),
    );
  });

  it('should return an InternalServerError when User entity returns error', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const bcryptDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUserPassword = new UpdateUserPassword(
      loggerDriver,
      bcryptDriver,
      userRepository,
      refreshTokenRepository,
    );

    bcryptDriver.encrypt.resolves('hash');
    userRepository.findOneById.resolves(<any>{ ...fakeUser, userId: '' });

    const newPassword = faker.internet.password();

    fakeUser.password = await bcryptDriver.encrypt(newPassword);

    userRepository.update.resolves();
    refreshTokenRepository.deleteAllByUser.resolves();

    const updateData = {
      user_id: userId,
      password: faker.internet.password(),
    };

    const user = <User>(
      await updateUserPassword.exec({ user: fakeUser, ...updateData })
    );

    expect(user).deep.equal(new InternalServerError('[User] "userId" required'));
  });
});
