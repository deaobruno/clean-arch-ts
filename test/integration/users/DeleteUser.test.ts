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
const Authorization = 'Bearer token';
const token = 'refresh-token';

routes(dependencies, server);

describe('DELETE /users', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get 204 status code when trying to delete an existing user', async () => {
    const deletedUserId = faker.string.uuid();

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
        email: faker.internet.email(),
        password: hashDriver.hashString(faker.internet.password()),
        role: UserRole.ROOT,
      })
      .onCall(2)
      .resolves({
        user_id: deletedUserId,
        email: faker.internet.email(),
        password: hashDriver.hashString(faker.internet.password()),
        role: UserRole.CUSTOMER,
      });
    sandbox.stub(MongoDbDriver.prototype, 'delete').resolves();
    sandbox.stub(MongoDbDriver.prototype, 'deleteMany').resolves();

    const { status } = await axios.delete(`${url}/${deletedUserId}`, {
      headers: { Authorization },
    });

    expect(status).equal(204);
  });

  it('should get 400 status code when trying to delete an user passing invalid user_id', async () => {
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
        email: faker.internet.email(),
        password: hashDriver.hashString(faker.internet.password()),
        role: UserRole.ROOT,
      });

    await axios
      .delete(`${url}/test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"user_id" must be a valid GUID');
      });
  });

  it('should get 404 status code when trying to delete an user with wrong id', async () => {
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
        email: faker.internet.email(),
        password: hashDriver.hashString(faker.internet.password()),
        role: UserRole.ROOT,
      });
    sandbox
      .stub(UserRepository.prototype, 'findOneById')
      .onCall(0)
      .resolves(
        <User>User.create({
          userId,
          email: faker.internet.email(),
          password: hashDriver.hashString(faker.internet.password()),
          role: UserRole.ROOT,
        }),
      )
      .onCall(1)
      .resolves();

    const wrongUserId = faker.string.uuid();

    await axios
      .delete(`${url}/${wrongUserId}`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal(`[DeleteUser] User not found: ${wrongUserId}`);
      });
  });
});
