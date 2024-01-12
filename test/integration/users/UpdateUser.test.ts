import sinon from "sinon";
import axios from "axios";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UserRole from "../../../src/domain/user/UserRole";
import config from "../../../src/config";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
import server from "../../../src/infra/http/v1/server";
import MongoDbDriver from "../../../src/infra/drivers/db/MongoDbDriver";
import JwtDriver from "../../../src/infra/drivers/token/JwtDriver";

const {
  db: {
    mongo: { dbUrl, dbName },
  },
} = config;
const sandbox = sinon.createSandbox();
const dbDriver = MongoDbDriver.getInstance(dbName);
const hashDriver = new CryptoDriver();
const url = "http://localhost:8080/api/v1/users";
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const Authorization = "Bearer token";
const token = "refresh-token";

describe("PUT /users/:user_id", () => {
  before(async () => {
    await dbDriver.connect(dbUrl);

    server.start(8080);
  });

  afterEach(() => sandbox.restore());

  after(async () => {
    await dbDriver.disconnect();

    server.stop();
  });

  it("should get 200 when trying to update an existing user", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: userId,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox
      .stub(MongoDbDriver.prototype, "findOne")
      .onFirstCall()
      .resolves({
        user_id: userId,
        token,
      })
      .onSecondCall()
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });
    sandbox.stub(MongoDbDriver.prototype, "update").resolves();
    sandbox.stub(MongoDbDriver.prototype, "delete").resolves();

    const newEmail = faker.internet.email();
    const payload = {
      email: newEmail,
    };
    const { status, data } = await axios.put(`${url}/${userId}`, payload, {
      headers: { Authorization },
    });

    expect(status).equal(200);
    expect(data.id).equal(userId);
    expect(data.email).equal(newEmail);
  });

  it("should get 400 status code when trying to update an user passing invalid id", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: userId,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves({
      user_id: userId,
      token,
    });

    const payload = {
      email: faker.internet.email(),
    };

    await axios
      .put(`${url}/test`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "user_id" format');
      });
  });

  it('should get 400 status code when trying to update an user passing empty "email" as param', async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: userId,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves({
      user_id: userId,
      token,
    });

    const payload = {
      email: "",
    };

    await axios
      .put(`${url}/${faker.string.uuid()}`, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"email" is required');
      });
  });

  it('should get 400 status code when trying to update an user passing invalid "email" as param', async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: userId,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves({
      user_id: userId,
      token,
    });

    const payload = {
      email: "test",
    };

    await axios
      .put(`${url}/${faker.string.uuid()}`, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "email" format');
      });
  });

  it("should get 400 status code when trying to update an user with invalid param", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: userId,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves({
      user_id: userId,
      token,
    });

    const payload = {
      email: "user@email.com",
      test: "test",
    };

    await axios
      .put(`${url}/${faker.string.uuid()}`, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(`Invalid param(s): "test"`);
      });
  });

  it("should get 404 status code when user is not found", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: userId,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves({
      user_id: userId,
      token,
    });

    const payload = {};

    await axios
      .put(`${url}/${faker.string.uuid()}`, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("User not found");
      });
  });

  it("should get 404 status code when authenticated customer is different from token user", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: hashDriver.hashString(faker.internet.password()),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves({
      user_id: userId,
      token,
    });

    const payload = {};

    await axios
      .put(`${url}/${userId}`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("User not found");
      });
  });
});
