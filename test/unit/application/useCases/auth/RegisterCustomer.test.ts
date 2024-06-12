import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import RegisterCustomer from '../../../../../src/application/useCases/auth/RegisterCustomer';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import CryptoDriver from '../../../../../src/infra/drivers/hash/CryptoDriver';
import BcryptDriver from '../../../../../src/infra/drivers/encryption/BcryptDriver';
import ConflictError from '../../../../../src/application/errors/ConflictError';
import BaseError from '../../../../../src/application/errors/BaseError';
import UserRepository from '../../../../../src/adapters/repositories/UserRepository';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';
import InternalServerError from '../../../../../src/application/errors/InternalServerError';

const sandbox = sinon.createSandbox();
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = <User>User.create({
  userId: faker.string.uuid(),
  email,
  password,
  role: UserRole.CUSTOMER,
});
const userData = {
  email,
  password,
  confirm_password: password,
  role: UserRole.CUSTOMER,
};

describe('/application/useCases/auth/RegisterCustomer.ts', () => {
  afterEach(() => sandbox.restore());

  it('should successfully create a Customer User', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const encryptionDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const registerCustomer = new RegisterCustomer(
      loggerDriver,
      cryptoDriver,
      encryptionDriver,
      userRepository,
    );

    userRepository.findOneByEmail.resolves();
    cryptoDriver.generateID.returns(faker.string.uuid());
    encryptionDriver.encrypt.resolves('hash');
    userRepository.create.resolves();
    sandbox.stub(User, 'create').returns(fakeUser);

    const user = <User>await registerCustomer.exec(userData);

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(userData.email);
    expect(user.password).equal(userData.password);
    expect(user.role).equal(UserRole.CUSTOMER);
    expect(user.isCustomer).equal(true);
    expect(user.isRoot).equal(false);
  });

  it('should fail when trying to create a Customer User with repeated email', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const encryptionDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const registerCustomer = new RegisterCustomer(
      loggerDriver,
      cryptoDriver,
      encryptionDriver,
      userRepository,
    );

    userRepository.findOneByEmail.resolves(fakeUser);

    const error = <BaseError>await registerCustomer.exec(userData);

    expect(error).deep.equal(
      new ConflictError(`[RegisterCustomer] Email already in use: ${email}`),
    );
  });

  it('should return an InternalServerError when User entity returns error', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const encryptionDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const registerCustomer = new RegisterCustomer(
      loggerDriver,
      cryptoDriver,
      encryptionDriver,
      userRepository,
    );

    const error = <BaseError>(
      await registerCustomer.exec({ ...userData, email: '' })
    );

    expect(error).deep.equal(
      new InternalServerError('[User] "userId" required'),
    );
  });
});
