import sinon from 'sinon';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UserRole from '../../../src/domain/user/UserRole';
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver';
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver';
import MongoDbDriver from '../../../src/infra/drivers/db/MongoDbDriver';
import JwtDriver from '../../../src/infra/drivers/token/JwtDriver';
import PinoDriver from '../../../src/infra/drivers/logger/PinoDriver';
import dependencies from '../../../src/dependencies';
import routes from '../../../src/routes/routes';
import config from '../../../src/config';

const sandbox = sinon.createSandbox();
const loggerDriver = sinon.createStubInstance(PinoDriver);
const hashDriver = new CryptoDriver(loggerDriver);
const server = new ExpressDriver(loggerDriver, hashDriver, config.cors);
const url = 'http://localhost:8080/api/v1/memos';
const memoId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.ROOT;
const Authorization = 'Bearer token';
const token = 'refresh-token';

routes(dependencies, server);

describe('DELETE /memos', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get 204 status code when trying to delete an existing memo', async () => {
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
      })
      .onCall(2)
      .resolves({
        memo_id: memoId,
        user_id: userId,
        title: 'New Title',
        text: 'Lorem ipsum',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      });
    sandbox.stub(MongoDbDriver.prototype, 'delete').resolves();

    const { status } = await axios.delete(`${url}/${memoId}`, {
      headers: { Authorization },
    });

    expect(status).equal(204);
  });

  it('should get 400 status code when trying to delete a memo passing invalid memo_id', async () => {
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
      .delete(`${url}/test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"memo_id" must be a valid GUID');
      });
  });

  it('should get 404 status code when trying to delete a memo with wrong memo_id', async () => {
    const userId = faker.string.uuid();
    const memoId = faker.string.uuid();

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
      .delete(`${url}/${memoId}`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal(`[DeleteMemo] Memo not found: ${memoId}`);
      });
  });
});
