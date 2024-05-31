import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import UpdateUser from '../../../../../src/application/useCases/user/UpdateUser';
import NotFoundError from '../../../../../src/application/errors/NotFoundError';
import BaseError from '../../../../../src/application/errors/BaseError';
import UserRepository from '../../../../../src/adapters/repositories/UserRepository';
import RefreshTokenRepository from '../../../../../src/adapters/repositories/RefreshTokenRepository';
import ConflictError from '../../../../../src/application/errors/ConflictError';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';
import InternalServerError from '../../../../../src/application/errors/InternalServerError';

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const fakeUser = <User>User.create({
  userId,
  email,
  password,
  role,
});

describe('/application/useCases/user/UpdateUser.ts', () => {
  afterEach(() => sandbox.restore());

  it('should update an existing user', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUser = new UpdateUser(
      loggerDriver,
      userRepository,
      refreshTokenRepository,
    );

    userRepository.findOneById.resolves(fakeUser);
    userRepository.update.resolves();
    refreshTokenRepository.deleteAllByUser.resolves();

    const newEmail = faker.internet.email();

    fakeUser.email = newEmail;

    userRepository.update.resolves();

    const updateData = {
      user_id: userId,
      email: newEmail,
    };
    const user = <User>await updateUser.exec({ user: fakeUser, ...updateData });

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(newEmail);
    expect(user.password).equal(fakeUser.password);
    expect(user.role).equal(fakeUser.role);
    expect(user.isCustomer).equal(true);
    expect(user.isRoot).equal(false);
  });

  it('should return same user when no attributes are updated', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUser = new UpdateUser(
      loggerDriver,
      userRepository,
      refreshTokenRepository,
    );

    userRepository.findOneById.resolves(fakeUser);
    userRepository.update.resolves();
    refreshTokenRepository.deleteAllByUser.resolves();

    userRepository.update.resolves();

    const updateData = {
      user_id: userId,
    };
    const user = <User>await updateUser.exec({ user: fakeUser, ...updateData });

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(fakeUser.email);
    expect(user.password).equal(fakeUser.password);
    expect(user.role).equal(fakeUser.role);
    expect(user.isCustomer).equal(true);
    expect(user.isRoot).equal(false);
  });

  it('should fail when trying to update an user passing wrong ID', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUser = new UpdateUser(
      loggerDriver,
      userRepository,
      refreshTokenRepository,
    );
    const user_id = 'test';
    const error = <BaseError>await updateUser.exec({
      user: <User>User.create({
        userId: faker.string.uuid(),
        email,
        password,
        role,
      }),
      user_id,
    });

    expect(error).deep.equal(
      new NotFoundError(`[UpdateUser] User not found: ${user_id}`),
    );
  });

  it('should return a NotFoundError when authenticated user is different from found user', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUser = new UpdateUser(
      loggerDriver,
      userRepository,
      refreshTokenRepository,
    );
    const error = <BaseError>await updateUser.exec({
      user: <User>User.create({
        userId: faker.string.uuid(),
        email,
        password,
        role,
      }),
      user_id: userId,
    });

    expect(error).deep.equal(
      new NotFoundError(`[UpdateUser] User not found: ${userId}`),
    );
  });

  it('should fail when user is not found', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUser = new UpdateUser(
      loggerDriver,
      userRepository,
      refreshTokenRepository,
    );
    const error = <BaseError>await updateUser.exec({
      user: <User>User.create({
        userId,
        email,
        password,
        role,
      }),
      user_id: userId,
    });

    expect(error).deep.equal(
      new NotFoundError(`[UpdateUser] User not found: ${userId}`),
    );
  });

  it('should fail when a customer is trying to update a root user', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUser = new UpdateUser(
      loggerDriver,
      userRepository,
      refreshTokenRepository,
    );

    userRepository.findOneById.resolves(
      <User>User.create({
        userId: faker.string.uuid(),
        email,
        password,
        role: UserRole.ROOT,
      }),
    );

    const user_id = 'test';
    const error = <BaseError>await updateUser.exec({
      user: <User>User.create({
        userId: faker.string.uuid(),
        email,
        password,
        role,
      }),
      user_id,
    });

    expect(error).deep.equal(
      new NotFoundError(`[UpdateUser] User not found: ${user_id}`),
    );
  });

  it('should fail when trying to create a Customer User with repeated email', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const newEmail = faker.internet.email();
    const newUser = <User>User.create({
      userId: faker.string.uuid(),
      email: newEmail,
      password,
      role,
    });
    const updateUser = new UpdateUser(
      loggerDriver,
      userRepository,
      refreshTokenRepository,
    );

    userRepository.findOneById.resolves(fakeUser);
    userRepository.findOneByEmail.resolves(newUser);
    userRepository.update.resolves();
    refreshTokenRepository.deleteAllByUser.resolves();

    fakeUser.email = newEmail;

    userRepository.update.resolves();

    const updateData = {
      user_id: userId,
      email: newEmail,
    };
    const error = await updateUser.exec({ user: fakeUser, ...updateData });

    expect(error).deep.equal(
      new ConflictError(`[UpdateUser] Email already in use: ${newEmail}`),
    );
  });

  it('should return an InternalServerError when User entity returns error', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const updateUser = new UpdateUser(
      loggerDriver,
      userRepository,
      refreshTokenRepository,
    );

    userRepository.findOneById.resolves(<any>{ ...fakeUser, userId: '' });
    userRepository.update.resolves();
    refreshTokenRepository.deleteAllByUser.resolves();

    const newEmail = faker.internet.email();

    fakeUser.email = newEmail;

    userRepository.update.resolves();

    const updateData = {
      user_id: userId,
      email: newEmail,
    };
    const user = <User>await updateUser.exec({ user: fakeUser, ...updateData });

    expect(user).deep.equal(new InternalServerError('[User] "userId" required'));
  });
});
