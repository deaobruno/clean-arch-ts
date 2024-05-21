import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import FindUserById from '../../../../../src/application/useCases/user/FindUserById';
import { expect } from 'chai';
import NotFoundError from '../../../../../src/application/errors/NotFoundError';
import BaseError from '../../../../../src/application/errors/BaseError';
import UserRepository from '../../../../../src/adapters/repositories/UserRepository';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

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

describe('/application/useCases/user/FindUserById.ts', () => {
  afterEach(() => sandbox.restore());

  it('should return an user passing an UUID', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const findUserById = new FindUserById(loggerDriver, userRepository);

    userRepository.findOneById.resolves(fakeUser);

    const user = <User>(
      await findUserById.exec({ user: fakeUser, user_id: userId })
    );

    expect(user.userId).equal(userId);
    expect(user.email).equal(fakeUser.email);
    expect(user.password).equal(fakeUser.password);
    expect(user.role).equal(fakeUser.role);
    expect(user.isCustomer).equal(true);
    expect(user.isRoot).equal(false);
  });

  it('should return a NotFoundError when authenticated user is different from request user', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const findUserById = new FindUserById(loggerDriver, userRepository);
    const user_id = 'test';
    const error = <BaseError>(
      await findUserById.exec({ user: fakeUser, user_id })
    );

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal(`[FindUserById] User not found: ${user_id}`);
    expect(error.statusCode).equal(404);
  });

  it('should return a NotFoundError when no user is found', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const findUserById = new FindUserById(loggerDriver, userRepository);

    userRepository.findOneById.resolves();

    const error = <BaseError>(
      await findUserById.exec({ user: fakeUser, user_id: userId })
    );

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal(`[FindUserById] User not found: ${userId}`);
    expect(error.statusCode).equal(404);
  });
});
