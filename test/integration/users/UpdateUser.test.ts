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
const url = 'http://localhost:8080/api/v1/users';
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const Authorization = 'Bearer token';
const token = 'refresh-token';

routes(dependencies, server);

describe('PUT /users/:user_id', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get 200 when trying to update an existing user', async () => {
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
      })
      .onCall(3)
      .resolves();
    sandbox.stub(MongoDbDriver.prototype, 'update').resolves();
    sandbox.stub(MongoDbDriver.prototype, 'deleteMany').resolves();

    const newEmail = faker.internet.email();
    const payload = {
      email: newEmail,
    };
    const { status, data } = await axios.put(`${url}/${userId}`, payload, {
      headers: { Authorization, 'Content-Type': 'application/json' },
    });

    expect(status).equal(200);
    expect(data.id).equal(userId);
    expect(data.email).equal(newEmail);
  });

  it('should get 400 status code when trying to update an user passing invalid id', async () => {
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
      email: faker.internet.email(),
    };

    await axios
      .put(`${url}/test`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"user_id" must be a valid GUID');
      });
  });

  it('should get 400 status code when trying to update an user passing empty "email" as param', async () => {
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
      email: '',
    };

    await axios
      .put(`${url}/${faker.string.uuid()}`, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"email" is not allowed to be empty');
      });
  });

  it('should get 400 status code when trying to update an user passing invalid "email" as param', async () => {
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
      email: 'test',
    };

    await axios
      .put(`${url}/${faker.string.uuid()}`, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"email" must be a valid email');
      });
  });

  it('should get 400 status code when trying to update an user with invalid param', async () => {
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
      email: 'user@email.com',
      test: 'test',
    };

    await axios
      .put(`${url}/${faker.string.uuid()}`, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"test" is not allowed');
      });
  });

  it('should get 404 status code when user is not found', async () => {
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
      .resolves();

    const wrongUserId = faker.string.uuid();
    const payload = {};

    await axios
      .put(`${url}/${wrongUserId}`, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal(`[UpdateUser] User not found: ${wrongUserId}`);
      });
  });

  it('should get 404 status code when authenticated customer is different from token user', async () => {
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

    const payload = {};

    await axios
      .put(`${url}/${userId}`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal(`[UpdateUser] User not found: ${userId}`);
      });
  });
});
