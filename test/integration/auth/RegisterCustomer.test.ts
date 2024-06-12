import sinon from 'sinon';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import MongoDbDriver from '../../../src/infra/drivers/db/MongoDbDriver';
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver';
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver';
import UserRole from '../../../src/domain/user/UserRole';
import PinoDriver from '../../../src/infra/drivers/logger/PinoDriver';
import dependencies from '../../../src/dependencies';
import routes from '../../../src/routes/routes';
import config from '../../../src/config';

const sandbox = sinon.createSandbox();
const loggerDriver = sinon.createStubInstance(PinoDriver);
const hashDriver = new CryptoDriver(loggerDriver);
const server = new ExpressDriver(loggerDriver, hashDriver, config.cors);
const url = 'http://localhost:8080/api/v1/auth/register';
const password = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;

routes(dependencies, server);

describe('POST /auth/register', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get status 201 when successfully registered a new customer', async () => {
    sandbox.stub(MongoDbDriver.prototype, 'findOne').resolves();
    sandbox.stub(MongoDbDriver.prototype, 'create').resolves();

    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: password,
    };
    const { status, data } = await axios.post(url, payload);

    expect(status).equal(201);
    expect(typeof data.id).equal('string');
    expect(data.email).equal(payload.email);
  });

  it('should get status 400 when trying to register a customer without "email"', async () => {
    const payload = {
      email: '',
      password,
      confirm_password: password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"email" is not allowed to be empty');
    });
  });

  it('should get status 400 when trying to register a customer with invalid "email"', async () => {
    const payload = {
      email: 'test',
      password,
      confirm_password: password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"email" must be a valid email');
    });
  });

  it('should get status 400 when "email" length is greater than 100', async () => {
    const payload = {
      email: `${faker.string.alphanumeric(100)}@email.com`,
      password,
      confirm_password: password,
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
      confirm_password: password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"password" is not allowed to be empty');
    });
  });

  it('should get status 400 when "password" length is lower than 8', async () => {
    const payload = {
      email: faker.internet.email(),
      password: `${faker.string.alpha(7)}`,
      confirm_password: password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal(
        '"password" length must be at least 8 characters long',
      );
    });
  });

  it('should get status 400 when "password" is greater than 64', async () => {
    const payload = {
      email: faker.internet.email(),
      password: `${faker.string.alpha(65)}`,
      confirm_password: password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal(
        '"password" length must be less than or equal to 64 characters long',
      );
    });
  });

  it('should get status 400 when "password" does not have a lower case character', async () => {
    const wrongPassword = `${faker.string.alpha({ length: 4, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      email: faker.internet.email(),
      password: wrongPassword,
      confirm_password: password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal(
        `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[a-z]/`,
      );
    });
  });

  it('should get status 400 when "password" does not have an upper case character', async () => {
    const wrongPassword = `${faker.string.alpha({ length: 4, casing: 'lower' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      email: faker.internet.email(),
      password: wrongPassword,
      confirm_password: password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal(
        `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[A-Z]/`,
      );
    });
  });

  it('should get status 400 when "password" does not have a number character', async () => {
    const wrongPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.fromCharacters('!@#$&*', 4)}`;
    const payload = {
      email: faker.internet.email(),
      password: wrongPassword,
      confirm_password: password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal(
        `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[0-9]/`,
      );
    });
  });

  it('should get status 400 when "password" does not have a special character', async () => {
    const wrongPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 4 })}`;
    const payload = {
      email: faker.internet.email(),
      password: wrongPassword,
      confirm_password: password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal(
        `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[!@#$&*]/`,
      );
    });
  });

  it('should get status 400 when trying to register a customer without "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: '',
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"confirm_password" must be [ref:password]');
    });
  });

  it('should get status 400 when trying to register a customer with different "password" and "confirm_password"', async () => {
    const confirm_password = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"confirm_password" must be [ref:password]');
    });
  });

  it('should get status 400 when trying to register a customer with invalid param', async () => {
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: password,
      test: true,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"test" is not allowed');
    });
  });

  it('should get status 409 when trying to register a customer with an previously registered email', async () => {
    const email = faker.internet.email();
    const payload = {
      email,
      password,
      confirm_password: password,
    };

    sandbox.stub(MongoDbDriver.prototype, 'findOne').resolves({
      user_id: faker.string.uuid(),
      email,
      password: hashDriver.hashString(password),
      role: UserRole.CUSTOMER,
    });
    sandbox.stub(MongoDbDriver.prototype, 'create').resolves();

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(409);
      expect(data.error).equal(
        `[RegisterCustomer] Email already in use: ${email}`,
      );
    });
  });
});
