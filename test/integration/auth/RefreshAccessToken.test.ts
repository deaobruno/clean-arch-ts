import sinon from "sinon";
import axios from "axios";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import JwtDriver from "../../../src/infra/drivers/token/JwtDriver";
import config from "../../../src/config";
import UserRole from "../../../src/domain/user/UserRole";
import MongoDbDriver from "../../../src/infra/drivers/db/MongoDbDriver";
import server from "../../../src/infra/http/v1/server";

const sandbox = sinon.createSandbox();
const url = "http://localhost:8080/api/v1/auth/refresh-token";
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const Authorization = "Bearer token";
const token = "refresh-token";

describe("POST /auth/refresh-token", () => {
  before(() => server.start(8080));

  afterEach(() => sandbox.restore());

  after(() => server.stop());

  it("should get 200 status code when trying to refresh an access token", async () => {
    const user_id = faker.string.uuid();

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: user_id });
    sandbox
      .stub(MongoDbDriver.prototype, "findOne")
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
    sandbox
      .stub(JwtDriver.prototype, "validateRefreshToken")
      .returns({ id: user_id });
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
    const user_id = faker.string.uuid();

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: user_id });
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves();

    await axios
      .post(url, { refresh_token: token }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(401);
        expect(data.error).equal("Unauthorized");
      });
  });

  it("should get 403 status code when authenticated user is different from token user", async () => {
    const user_id = faker.string.uuid();

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: faker.string.uuid() });
    sandbox
      .stub(MongoDbDriver.prototype, "findOne")
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

    await axios
      .post(url, { refresh_token: token }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403);
        expect(data.error).equal("Token does not belong to user");
      });
  });

  it("should get 403 status code when refresh token is expired", async () => {
    const user_id = faker.string.uuid();

    const expiredToken = jwt.sign(
      {
        id: user_id,
        email,
        password,
        role: UserRole.CUSTOMER,
      },
      config.app.refreshTokenSecret,
      { expiresIn: -10 }
    );

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: user_id });
    sandbox
      .stub(MongoDbDriver.prototype, "findOne")
      .onCall(0)
      .resolves({
        user_id,
        token: expiredToken,
      })
      .onCall(1)
      .resolves({
        user_id,
        email,
        password,
        role,
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
    const user_id = faker.string.uuid();

    const invalidToken = jwt.sign(
      {
        id: user_id,
        email,
        password,
        role: UserRole.CUSTOMER,
      },
      "invalid-key"
    );

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: user_id });
    sandbox
      .stub(MongoDbDriver.prototype, "findOne")
      .onCall(0)
      .resolves({
        user_id,
        token: invalidToken,
      })
      .onCall(1)
      .resolves({
        user_id,
        email,
        password,
        role,
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
