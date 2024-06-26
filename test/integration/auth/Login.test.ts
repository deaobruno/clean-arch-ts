import axios from 'axios';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver';
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver';
import UserRole from '../../../src/domain/user/UserRole';
import MongoDbDriver from '../../../src/infra/drivers/db/MongoDbDriver';
import BcryptDriver from '../../../src/infra/drivers/encryption/BcryptDriver';
import PinoDriver from '../../../src/infra/drivers/logger/PinoDriver';
import dependencies from '../../../src/dependencies';
import routes from '../../../src/routes/routes';
import config from '../../../src/config';

const sandbox = sinon.createSandbox();
const loggerDriver = sinon.createStubInstance(PinoDriver);
const hashDriver = new CryptoDriver(loggerDriver);
const server = new ExpressDriver(loggerDriver, hashDriver, config.cors);
const url = 'http://localhost:8080/api/v1/auth/login';
const email = faker.internet.email();
const password = faker.internet.password();

routes(dependencies, server);

describe('POST /auth', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get status 200 when successfully authenticated an user', async () => {
    sandbox.stub(BcryptDriver.prototype, 'compare').resolves(true);
    sandbox.stub(MongoDbDriver.prototype, 'findOne').resolves({
      user_id: faker.string.uuid(),
      email,
      password: hashDriver.hashString(password),
      role: UserRole.CUSTOMER,
    });
    sandbox.stub(MongoDbDriver.prototype, 'create').resolves();

    const payload = {
      email,
      password,
    };
    const { status, data } = await axios.post(url, payload);

    expect(status).equal(200);
    expect(typeof data.accessToken).equal('string');
    expect(typeof data.refreshToken).equal('string');
  });

  it('should get status 400 when trying to authenticate an user without "email"', async () => {
    const payload = {
      email: '',
      password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"email" is not allowed to be empty');
    });
  });

  it('should get status 400 when trying to authenticate an user with invalid "email"', async () => {
    const payload = {
      email: 'test',
      password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"email" must be a valid email');
    });
  });

  it('should get status 400 when trying to authenticate an user without "password"', async () => {
    const payload = {
      email,
      password: '',
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"password" is not allowed to be empty');
    });
  });

  it('should get status 400 when trying to authenticate an user with invalid param', async () => {
    const payload = {
      email,
      password,
      test: true,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"test" is not allowed');
    });
  });

  it('should get status 401 when trying to authenticate an user that does not exist', async () => {
    sandbox.stub(MongoDbDriver.prototype, 'findOne').resolves();

    const payload = {
      email: faker.internet.email(),
      password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(401);
      expect(data.error).equal('Unauthorized');
    });
  });

  it('should get status 401 when trying to authenticate an existing user with wrong password', async () => {
    sandbox.stub(MongoDbDriver.prototype, 'findOne').resolves({
      user_id: faker.string.uuid(),
      email,
      password: hashDriver.hashString(faker.internet.password()),
      role: UserRole.CUSTOMER,
    });
    const payload = {
      email,
      password: '12345679',
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(401);
      expect(data.error).equal('Unauthorized');
    });
  });
});
