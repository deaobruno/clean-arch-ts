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
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.ROOT;
const Authorization = 'Bearer token';
const token = 'refresh-token';

routes(dependencies, server);

describe('GET /memos/user/:memo_id', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get 200 status code and an array with memo data when trying to find memos by user_id', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/memos`;
    const memos = [
      {
        memo_id: faker.string.uuid(),
        user_id: userId,
        title: 'Memo 1',
        text: 'Lorem ipsum',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      },
      {
        memo_id: faker.string.uuid(),
        user_id: userId,
        title: 'Memo 2',
        text: 'Lorem ipsum',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      },
      {
        memo_id: faker.string.uuid(),
        user_id: userId,
        title: 'Memo 3',
        text: 'Lorem ipsum',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      },
    ];

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
    sandbox.stub(MongoDbDriver.prototype, 'find').resolves(memos);

    const { status, data } = await axios.get(url, {
      headers: { Authorization, 'Content-Type': 'application/json' },
    });

    expect(status).equal(200);
    expect(data[0].id).equal(memos[0].memo_id);
    expect(data[0].title).equal(memos[0].title);
    expect(data[0].text).equal(memos[0].text);
    expect(data[0].start).equal(memos[0].start);
    expect(data[0].end).equal(memos[0].end);
    expect(data[1].id).equal(memos[1].memo_id);
    expect(data[1].title).equal(memos[1].title);
    expect(data[1].text).equal(memos[1].text);
    expect(data[1].start).equal(memos[1].start);
    expect(data[1].end).equal(memos[1].end);
    expect(data[2].id).equal(memos[2].memo_id);
    expect(data[2].title).equal(memos[2].title);
    expect(data[2].text).equal(memos[2].text);
    expect(data[2].start).equal(memos[2].start);
    expect(data[2].end).equal(memos[2].end);
  });

  it('should get 400 status code when trying to find memos passing invalid user_id', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/test/memos`;

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
      .get(url, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"user_id" must be a valid GUID');
      });
  });

  it('should get 404 status code when memos are not found', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/memos`;

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
    sandbox.stub(MongoDbDriver.prototype, 'find').resolves([]);

    await axios
      .get(url, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal(
          `[FindMemosByUserId] Memos not found for user: ${userId}`,
        );
      });
  });
});
