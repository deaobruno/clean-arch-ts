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
import { MongoClient } from "mongodb";

const sandbox = sinon.createSandbox();
const {
  db: {
    mongo: { dbUrl },
  },
} = config;
const hashDriver = new CryptoDriver();
const dbDriver = MongoDbDriver.getInstance(dbUrl, "test");
const url = "http://localhost:8080/api/v1/auth/logout";
const user_id = faker.string.uuid();
const email = faker.internet.email();
const password = hashDriver.hashString(faker.internet.password());
const role = UserRole.CUSTOMER;
const Authorization = "Bearer token";
const token = "refresh-token";

describe("DELETE /auth/logout", () => {
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

  it("should get 204 status code when successfully log an user out", async () => {
    sandbox.stub(JwtDriver.prototype, "validateAccessToken").returns({
      id: user_id,
      email,
      password,
      role,
    });
    sandbox
      .stub(dbDriver, "findOne")
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
    sandbox.stub(dbDriver, "delete").resolves();

    const { status } = await axios.delete(url, {
      headers: { Authorization },
      data: { refresh_token: token },
    });

    expect(status).equal(204);
  });
});
