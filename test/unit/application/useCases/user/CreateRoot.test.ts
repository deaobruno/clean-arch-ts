import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import CreateRoot from '../../../../../src/application/useCases/user/CreateRoot';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import UserRepository from '../../../../../src/adapters/repositories/UserRepository';
import CryptoDriver from '../../../../../src/infra/drivers/hash/CryptoDriver';
import BcryptDriver from '../../../../../src/infra/drivers/encryption/BcryptDriver';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

const sandbox = sinon.createSandbox();
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = <User>User.create({
  userId: faker.string.uuid(),
  email,
  password,
  role: UserRole.ROOT,
});
const userData = {
  email,
  password,
  confirm_password: password,
  role: UserRole.ROOT,
};

describe('/application/useCases/user/CreateRoot.ts', () => {
  afterEach(() => sandbox.restore());

  it('should successfully create a Root User', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const encryptionDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const createRoot = new CreateRoot(
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

    const result = await createRoot.exec(userData);

    expect(result).equal(undefined);
  });

  it('should return void when Root User already exists', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const encryptionDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const createRoot = new CreateRoot(
      loggerDriver,
      cryptoDriver,
      encryptionDriver,
      userRepository,
    );

    userRepository.findOneByEmail.resolves(fakeUser);

    const result = await createRoot.exec(userData);

    expect(result).equal(undefined);
  });

  it('should return void when User entity returns error', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const encryptionDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const createRoot = new CreateRoot(
      loggerDriver,
      cryptoDriver,
      encryptionDriver,
      userRepository,
    );

    const result = await createRoot.exec({ ...userData, email: '' });

    expect(result).equal(undefined);
  });
});
