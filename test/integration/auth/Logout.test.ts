import axios from "axios";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import sinon from "sinon";
import config from "../../../src/config";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
import UserRole from "../../../src/domain/user/UserRole";
import server from "../../../src/infra/http/v1/server";
import MongoDbDriver from "../../../src/infra/drivers/db/MongoDbDriver";
import JwtDriver from "../../../src/infra/drivers/token/JwtDriver";

const sandbox = sinon.createSandbox();
const {
  db: {
    mongo: { dbUrl, dbName },
  },
} = config;
const hashDriver = new CryptoDriver();
const dbDriver = MongoDbDriver.getInstance(dbName);
const url = "http://localhost:8080/api/v1/auth/logout";
const user_id = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const Authorization = "Bearer token";
const token = "refresh-token";

describe("DELETE /auth/logout", () => {
  before(async () => {
    await dbDriver.connect(dbUrl);

    server.start(8080);
  });

  afterEach(() => sandbox.restore());

  after(async () => {
    await dbDriver.disconnect();

    server.stop();
  });

  it("should get 204 status code when successfully log an user out", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: user_id,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves({
      user_id,
      token,
    });
    sandbox.stub(MongoDbDriver.prototype, "delete").resolves();

    const { status } = await axios.delete(url, {
      headers: { Authorization },
      data: { refresh_token: token },
    });

    expect(status).equal(204);
  });

  it("should get 404 status code when refreshToken is not found", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: user_id,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").onFirstCall().resolves({
      user_id,
      token,
    });

    await axios
      .delete(url, {
        headers: { Authorization },
        data: { refresh_token: token },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("Refresh token not found");
      });
  });

  it("should get 403 status code when authenticated user is different from token user", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: user_id,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox
      .stub(MongoDbDriver.prototype, "findOne")
      .onFirstCall()
      .resolves({
        user_id,
        token,
      })
      .onSecondCall()
      .resolves({
        user_id: faker.string.uuid(),
        token,
      });

    await axios
      .delete(url, {
        headers: { Authorization },
        data: { refresh_token: token },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403);
        expect(data.error).equal("Token does not belong to user");
      });
  });
});
