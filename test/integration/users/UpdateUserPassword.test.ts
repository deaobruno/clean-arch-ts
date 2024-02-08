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
import UserRepository from "../../../src/adapters/repositories/UserRepository";
import User from "../../../src/domain/user/User";
import { MongoClient } from "mongodb";

const {
  db: {
    mongo: { dbUrl },
  },
} = config;
const sandbox = sinon.createSandbox();
const dbDriver = MongoDbDriver.getInstance(dbUrl, "test");
const hashDriver = new CryptoDriver();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const Authorization = "Bearer token";
const token = "refresh-token";

describe("PUT /users/:user_id/update-password", () => {
  let client: MongoClient

  before(async () => {
    client = await dbDriver.connect();

    server.start(8080);
  });

  afterEach(() => sandbox.restore());

  after(async () => {
    await dbDriver.disconnect(client);

    server.stop();
  });

  it("should get 200 when trying to update the password of an existing user", async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox
      .stub(dbDriver, "findOne")
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
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });
    sandbox.stub(dbDriver, "update").resolves();
    sandbox.stub(dbDriver, "deleteMany").resolves();

    const newPassword = faker.internet.password();
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    };
    const { status, data } = await axios.put(url, payload, {
      headers: { Authorization, "Content-Type": "application/json" },
    });

    expect(status).equal(200);
    expect(data.id).equal(userId);
    expect(data.email).equal(email);
  });

  it("should get 400 status code when trying to update an user passing invalid id", async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox
      .stub(dbDriver, "findOne")
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

    const newPassword = faker.internet.password();
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    };

    await axios
      .put(url.replace(userId, "test"), payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "user_id" format');
      });
  });

  it('should get 400 status code when trying to update an user passing empty "password" as param', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox
      .stub(dbDriver, "findOne")
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
      password: "",
      confirm_password: faker.internet.password(),
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"password" is required');
      });
  });

  it('should get 400 status code when trying to update an user passing empty "confirm_password" as param', async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox
      .stub(dbDriver, "findOne")
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
      password: faker.internet.password(),
      confirm_password: "",
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"confirm_password" is required');
      });
  });

  it("should get 400 status code when trying to update an user password passing invalid param", async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox
      .stub(dbDriver, "findOne")
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

    const newPassword = faker.internet.password();
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
      test: "test",
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(`Invalid param(s): "test"`);
      });
  });

  it("should get 404 status code when user is not found", async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox
      .stub(dbDriver, "findOne")
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves();

    const newPassword = faker.internet.password();
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("User not found");
      });
  });

  it("should get 404 status code when authenticated customer is different from token user", async () => {
    const userId = faker.string.uuid();
    const url = `http://localhost:8080/api/v1/users/${userId}/update-password`;

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox.stub(dbDriver, "findOne").resolves({
      user_id: userId,
      token,
    });
    sandbox
      .stub(UserRepository.prototype, "findOneById")
      .onCall(0)
      .resolves(
        User.create({
          userId,
          email,
          password: hashDriver.hashString(password),
          role,
        })
      )
      .onCall(1)
      .resolves();

    const newPassword = faker.internet.password();
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    };

    await axios
      .put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("User not found");
      });
  });
});
