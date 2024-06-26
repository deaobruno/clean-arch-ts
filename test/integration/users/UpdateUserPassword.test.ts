import sinon from 'sinon';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UserRole from '../../../src/domain/user/UserRole';
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver';
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver';
import MongoDbDriver from '../../../src/infra/drivers/db/MongoDbDriver';
import JwtDriver from '../../../src/infra/drivers/token/JwtDriver';
import UserRepository from '../../../src/adapters/repositories/UserRepository';
import User from '../../../src/domain/user/User';
import PinoDriver from '../../../src/infra/drivers/logger/PinoDriver';
import dependencies from '../../../src/dependencies';
import routes from '../../../src/routes/routes';
import config from '../../../src/config';

const sandbox = sinon.createSandbox();
const loggerDriver = sinon.createStubInstance(PinoDriver);
const hashDriver = new CryptoDriver(loggerDriver);
const server = new ExpressDriver(loggerDriver, hashDriver, config.cors);
const email = faker.internet.email();
const password = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
const role = UserRole.CUSTOMER;
const Authorization = 'Bearer token';
const token = 'refresh-token';

routes(dependencies, server);

describe('PUT /users/:user_id/update-password', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get 200 when trying to update the password of an existing user', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      })
      .onCall(2)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });
    sandbox.stub(MongoDbDriver.prototype, 'update').resolves();
    sandbox.stub(MongoDbDriver.prototype, 'deleteMany').resolves();

    const newPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    };
    const { status, data } = await axios.put(url, payload, {
      headers: { Authorization, 'Content-Type': 'application/json' },
    });

    expect(status).equal(200);
    expect(data.id).equal(userId);
    expect(data.email).equal(email);
  });

  it('should get 400 status code when trying to update an user passing invalid id', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const newPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    };

    await axios
      .put(url.replace(userId, 'test'), payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"user_id" must be a valid GUID');
      });
  });

  it('should get 400 status code when trying to update an user passing empty "password" as param', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const payload = {
      password: '',
      confirm_password: faker.internet.password(),
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"password" is not allowed to be empty');
      });
  });

  it('should get status 400 when "password" length is lower than 8', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const payload = {
      password: `${faker.string.alpha(7)}`,
      confirm_password: password,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(
          '"password" length must be at least 8 characters long',
        );
      });
  });

  it('should get status 400 when "password" is greater than 64', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const payload = {
      password: `${faker.string.alpha(65)}`,
      confirm_password: password,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(
          '"password" length must be less than or equal to 64 characters long',
        );
      });
  });

  it('should get status 400 when "password" does not have a lower case character', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const wrongPassword = `${faker.string.alpha({ length: 4, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      password: wrongPassword,
      confirm_password: password,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(
          `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[a-z]/`,
        );
      });
  });

  it('should get status 400 when "password" does not have an upper case character', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const wrongPassword = `${faker.string.alpha({ length: 4, casing: 'lower' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      password: wrongPassword,
      confirm_password: password,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(
          `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[A-Z]/`,
        );
      });
  });

  it('should get status 400 when "password" does not have a number character', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const wrongPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.fromCharacters('!@#$&*', 4)}`;
    const payload = {
      password: wrongPassword,
      confirm_password: password,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(
          `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[0-9]/`,
        );
      });
  });

  it('should get status 400 when "password" does not have a special character', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const wrongPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 4 })}`;
    const payload = {
      password: wrongPassword,
      confirm_password: password,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(
          `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[!@#$&*]/`,
        );
      });
  });

  it('should get 400 status code when trying to update an user passing empty "confirm_password" as param', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const payload = {
      password,
      confirm_password: '',
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"confirm_password" must be [ref:password]');
      });
  });

  it('should get 400 status code when trying to update an user password passing invalid param', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    const newPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
      test: 'test',
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"test" is not allowed');
      });
  });

  it('should get 404 status code when user is not found', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves();

    const newPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403);
        expect(data.error).equal(
          `[ValidateAuthentication] User not found: ${userId}`,
        );
      });
  });

  it('should get 404 status code when authenticated customer is different from token user', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox.stub(MongoDbDriver.prototype, 'findOne').resolves({
      user_id: userId,
      token,
    });
    sandbox
      .stub(UserRepository.prototype, 'findOneById')
      .onCall(0)
      .resolves(
        <User>User.create({
          userId,
          email,
          password: hashDriver.hashString(password),
          role,
        }),
      )
      .onCall(1)
      .resolves();

    const newPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal(
          `[UpdateUserPassword] User not found: ${userId}`,
        );
      });
  });
});
