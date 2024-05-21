import sinon from 'sinon';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UserRole from '../../../src/domain/user/UserRole';
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver';
import server from '../../../src/infra/http/v1/server';
import MongoDbDriver from '../../../src/infra/drivers/db/MongoDbDriver';
import JwtDriver from '../../../src/infra/drivers/token/JwtDriver';
import UserRepository from '../../../src/adapters/repositories/UserRepository';
import User from '../../../src/domain/user/User';
import PinoDriver from '../../../src/infra/drivers/logger/PinoDriver';

const sandbox = sinon.createSandbox();
const loggerDriver = sinon.createStubInstance(PinoDriver);
const hashDriver = new CryptoDriver(loggerDriver);
const url = 'http://localhost:8080/api/v1/users';
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const Authorization = 'Bearer token';
const token = 'refresh-token';

describe('GET /users/:user_id', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get 200 status code and an object with a single user data when trying to find an user by id', async () => {
    const userId = faker.string.uuid();

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox.stub(MongoDbDriver.prototype, 'findOne').onCall(0).resolves({
      user_id: userId,
      token,
    });
    sandbox.stub(UserRepository.prototype, 'findOneById').resolves(
      <User>User.create({
        userId,
        email,
        password: hashDriver.hashString(password),
        role: UserRole.CUSTOMER,
      }),
    );

    const { status, data } = await axios.get(`${url}/${userId}`, {
      headers: { Authorization, 'Content-Type': 'application/json' },
    });

    expect(status).equal(200);
    expect(data.id).equal(userId);
    expect(typeof data.email).equal('string');
  });

  it('should get 400 status code when trying to find an user passing invalid id', async () => {
    const userId = faker.string.uuid();

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

    await axios
      .get(`${url}/test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"user_id" must be a valid GUID');
      });
  });

  it('should get 404 status code when authenticated customer ID is different from request user_id', async () => {
    const userId = faker.string.uuid();

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox.stub(MongoDbDriver.prototype, 'findOne').onCall(0).resolves({
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
          role: UserRole.CUSTOMER,
        }),
      )
      .onCall(1)
      .resolves();

    const wrongUserId = faker.string.uuid();

    await axios
      .get(`${url}/${wrongUserId}`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal(
          `[FindUserById] User not found: ${wrongUserId}`,
        );
      });
  });

  it('should get 404 status code when user is not found', async () => {
    const userId = faker.string.uuid();

    sandbox
      .stub(JwtDriver.prototype, 'validateAccessToken')
      .returns({ id: userId });
    sandbox.stub(MongoDbDriver.prototype, 'findOne').onCall(0).resolves({
      user_id: userId,
      token,
    });
    sandbox
      .stub(UserRepository.prototype, 'findOneById')
      .onCall(0)
      .resolves(
        <User>User.create({
          userId: faker.string.uuid(),
          email: faker.internet.email(),
          password: hashDriver.hashString(faker.internet.password()),
          role: UserRole.CUSTOMER,
        }),
      )
      .onCall(1)
      .resolves();

    await axios
      .get(`${url}/${userId}`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal(`[FindUserById] User not found: ${userId}`);
      });
  });
});
