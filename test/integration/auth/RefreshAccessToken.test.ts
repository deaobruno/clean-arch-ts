import sinon from "sinon";
import axios from "axios";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import JwtDriver from "../../../src/infra/drivers/token/JwtDriver";
import config from "../../../src/config";
import UserRole from "../../../src/domain/user/UserRole";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
import MongoDbDriver from "../../../src/infra/drivers/db/MongoDbDriver";
import server from "../../../src/infra/http/v1/server";

const {
  db: {
    mongo: { dbUrl, dbName },
  },
} = config;
const sandbox = sinon.createSandbox();
const dbDriver = MongoDbDriver.getInstance(dbName);
const hashDriver = new CryptoDriver();
const url = "http://localhost:8080/api/v1/auth/refresh-token";
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const Authorization = "Bearer token";
const token = "refresh-token";

describe("POST /auth/refresh-token", () => {
  before(async () => {
    await dbDriver.connect(dbUrl);

    server.start(8080);
  });

  afterEach(() => sandbox.restore());

  after(async () => {
    await dbDriver.disconnect();

    server.stop();
  });

  it("should get 200 status code when trying to refresh an access token", async () => {
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
    sandbox.stub(JwtDriver.prototype, "validateRefreshToken").returns({
      id: userId,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "delete").resolves();
    sandbox.stub(MongoDbDriver.prototype, "create").resolves();

    const {
      status,
      data: { accessToken },
    } = await axios.post(
      url,
      { refresh_token: token },
      { headers: { Authorization } }
    );

    expect(status).equal(200);
    expect(typeof accessToken).equal("string");
  });

  it("should get 401 status code when trying to refresh an access token without a previous refresh token", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: userId,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves();

    await axios
      .post(url, { refresh_token: token }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(401);
        expect(data.error).equal("Unauthorized");
      });
  });

  it("should get 403 status code when previous RefreshToken is not found", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: userId,
      email,
      password: hashDriver.hashString(password),
      role,
    });
    sandbox.stub(MongoDbDriver.prototype, "findOne").onFirstCall().resolves({
      user_id: userId,
      token,
    });

    await axios
      .post(url, { refresh_token: "token" }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403);
        expect(data.error).equal("Refresh token not found");
      });
  });

  it("should get 403 status code when authenticated user is different from token user", async () => {
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
        user_id: faker.string.uuid(),
        token,
      });

    await axios
      .post(url, { refresh_token: token }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403);
        expect(data.error).equal("Token does not belong to user");
      });
  });

  it("should get 403 status code when refresh token is expired", async () => {
    const expiredToken = jwt.sign(
      {
        id: userId,
        email,
        password,
        role: UserRole.CUSTOMER,
      },
      config.app.refreshTokenSecret,
      { expiresIn: -10 }
    );

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
        token: expiredToken,
      });

    await axios
      .post(
        url,
        { refresh_token: expiredToken },
        { headers: { Authorization } }
      )
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403);
        expect(data.error).equal("Refresh token expired");
      });
  });

  it("should get 403 status code when refresh token is invalid", async () => {
    const invalidToken = jwt.sign(
      {
        id: userId,
        email,
        password,
        role: UserRole.CUSTOMER,
      },
      "invalid-key"
    );

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
        token: invalidToken,
      });

    await axios
      .post(
        url,
        { refresh_token: invalidToken },
        { headers: { Authorization } }
      )
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403);
        expect(data.error).equal("Invalid refresh token");
      });
  });
});
