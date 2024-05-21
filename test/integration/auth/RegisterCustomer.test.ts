import sinon from 'sinon';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import MongoDbDriver from '../../../src/infra/drivers/db/MongoDbDriver';
import server from '../../../src/infra/http/v1/server';
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver';
import UserRole from '../../../src/domain/user/UserRole';

const sandbox = sinon.createSandbox();
const cryptoDriver = new CryptoDriver();
const url = 'http://localhost:8080/api/v1/auth/register';

describe('POST /auth/register', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get status 201 when successfully registered a new customer', async () => {
    sandbox.stub(MongoDbDriver.prototype, 'findOne').resolves();
    sandbox.stub(MongoDbDriver.prototype, 'create').resolves();

    const payload = {
      email: faker.internet.email(),
      password: '12345678',
      confirm_password: '12345678',
    };
    const { status, data } = await axios.post(url, payload);

    expect(status).equal(201);
    expect(typeof data.id).equal('string');
    expect(data.email).equal(payload.email);
  });

  it('should get status 400 when trying to register a customer without "email"', async () => {
    const payload = {
      email: '',
      password: '12345678',
      confirm_password: '12345678',
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"email" is not allowed to be empty');
    });
  });

  it('should get status 400 when trying to register a customer with invalid "email"', async () => {
    const payload = {
      email: 'test',
      password: '12345678',
      confirm_password: '12345678',
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"email" must be a valid email');
    });
  });

  it('should get status 400 when trying to register a customer without "password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '',
      confirm_password: '12345678',
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"password" is not allowed to be empty');
    });
  });

  it('should get status 400 when trying to register a customer without "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '12345678',
      confirm_password: '',
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"confirm_password" must be [ref:password]');
    });
  });

  it('should get status 400 when trying to register a customer with different "password" and "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '12345678',
      confirm_password: '12345679',
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"confirm_password" must be [ref:password]');
    });
  });

  it('should get status 400 when trying to register a customer with invalid param', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '12345678',
      confirm_password: '12345678',
      test: true,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"test" is not allowed');
    });
  });

  it('should get status 409 when trying to register a customer with an previously registered email', async () => {
    const email = faker.internet.email();
    const password = '12345678';
    const payload = {
      email,
      password,
      confirm_password: password,
    };

    sandbox.stub(MongoDbDriver.prototype, 'findOne').resolves({
      user_id: faker.string.uuid(),
      email,
      password: cryptoDriver.hashString(password),
      role: UserRole.CUSTOMER,
    });
    sandbox.stub(MongoDbDriver.prototype, 'create').resolves();

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(409);
      expect(data.error).equal('Email already in use');
    });
  });
});
