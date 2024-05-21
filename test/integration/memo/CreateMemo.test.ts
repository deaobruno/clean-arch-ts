import sinon from 'sinon';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import MongoDbDriver from '../../../src/infra/drivers/db/MongoDbDriver';
import server from '../../../src/infra/http/v1/server';
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver';
import UserRole from '../../../src/domain/user/UserRole';
import JwtDriver from '../../../src/infra/drivers/token/JwtDriver';

const sandbox = sinon.createSandbox();
const hashDriver = new CryptoDriver();
const url = 'http://localhost:8080/api/v1/memos';
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const Authorization = 'Bearer token';
const token = 'refresh-token';

describe('POST /memos', () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it('should get status 201 when successfully created a new memo', async () => {
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
    sandbox.stub(MongoDbDriver.prototype, 'create').resolves();

    const payload = {
      title: 'New Title',
      text: 'Lorem ipsum',
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };
    const { status, data } = await axios.post(url, payload, {
      headers: { Authorization, 'Content-Type': 'application/json' },
    });

    expect(status).equal(201);
    expect(typeof data.id).equal('string');
    expect(data.title).equal(payload.title);
    expect(data.text).equal(payload.text);
    expect(data.start).equal(payload.start);
    expect(data.end).equal(payload.end);
  });

  it('should get status 400 when trying to register a memo without "title"', async () => {
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

    const payload = {
      title: '',
      text: 'Lorem ipsum',
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"title" is not allowed to be empty');
      });
  });

  it('should get status 400 when trying to register a memo without "text"', async () => {
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

    const payload = {
      title: 'New Title',
      text: '',
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"text" is not allowed to be empty');
      });
  });

  it('should get status 400 when trying to register a memo without "start"', async () => {
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

    const payload = {
      title: 'New Title',
      text: 'Lorem ipsum',
      start: '',
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"start" must be in ISO 8601 date format');
      });
  });

  it('should get status 400 when trying to register a memo without "end"', async () => {
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

    const payload = {
      title: 'New Title',
      text: 'Lorem ipsum',
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: '',
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"end" must be in ISO 8601 date format');
      });
  });

  it('should get status 400 when trying to register a memo with invalid param', async () => {
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

    const payload = {
      title: 'New Title',
      text: 'Lorem ipsum',
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      test: true,
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"test" is not allowed');
      });
  });
});
