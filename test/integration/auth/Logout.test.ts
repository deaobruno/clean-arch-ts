import axios from 'axios';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import sinon from 'sinon';
import MongoDbDriver from '../../../src/infra/drivers/db/MongoDbDriver';
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver';
import UserRole from '../../../src/domain/user/UserRole';
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver';
import JwtDriver from '../../../src/infra/drivers/token/JwtDriver';
import PinoDriver from '../../../src/infra/drivers/logger/PinoDriver';
import dependencies from '../../../src/dependencies';
import routes from '../../../src/routes/routes';
import config from '../../../src/config';

const sandbox = sinon.createSandbox();
const loggerDriver = sinon.createStubInstance(PinoDriver);
const hashDriver = new CryptoDriver(loggerDriver);
const server = new ExpressDriver(loggerDriver, hashDriver, config.cors);
const url = 'http://localhost:8080/api/v1/auth/logout';
const user_id = faker.string.uuid();
const email = faker.internet.email();
const password = hashDriver.hashString(faker.internet.password());
const role = UserRole.CUSTOMER;
const Authorization = 'Bearer token';
const token = 'refresh-token';

routes(dependencies, server);

describe('DELETE /auth/logout', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get 204 status code when successfully log an user out', async () => {
    sandbox.stub(JwtDriver.prototype, 'validateAccessToken').returns({
      id: user_id,
    });
    sandbox
      .stub(MongoDbDriver.prototype, 'findOne')
      .onCall(0)
      .resolves({
        user_id,
        token,
      })
      .onCall(1)
      .resolves({
        user_id,
        email,
        password,
        role,
      });
    sandbox.stub(MongoDbDriver.prototype, 'delete').resolves();

    const { status } = await axios.delete(url, {
      headers: { Authorization },
      data: { refresh_token: token },
    });

    expect(status).equal(204);
  });
});
