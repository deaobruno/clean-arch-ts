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
const url = "http://localhost:8080/api/v1/users";
const userId = faker.string.uuid();
const Authorization = "Bearer token";
const token = "refresh-token";

describe("DELETE /users", () => {
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

  it("should get 204 status code when trying to delete an existing user", async () => {
    const deletedUserId = faker.string.uuid();

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
        email: faker.internet.email(),
        password: hashDriver.hashString(faker.internet.password()),
        role: UserRole.ROOT,
      })
      .onCall(2)
      .resolves({
        user_id: deletedUserId,
        email: faker.internet.email(),
        password: hashDriver.hashString(faker.internet.password()),
        role: UserRole.CUSTOMER,
      });
    sandbox.stub(dbDriver, "delete").resolves();
    sandbox.stub(dbDriver, "deleteMany").resolves();

    const { status } = await axios.delete(`${url}/${deletedUserId}`, {
      headers: { Authorization },
    });

    expect(status).equal(204);
  });

  it("should get 400 status code when trying to delete an user passing invalid user_id", async () => {
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
        email: faker.internet.email(),
        password: hashDriver.hashString(faker.internet.password()),
        role: UserRole.ROOT,
      });

    await axios
      .delete(`${url}/test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "user_id" format');
      });
  });

  it("should get 404 status code when trying to delete an user with wrong id", async () => {
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
        email: faker.internet.email(),
        password: hashDriver.hashString(faker.internet.password()),
        role: UserRole.ROOT,
      });
    sandbox
      .stub(UserRepository.prototype, "findOneById")
      .onCall(0)
      .resolves(
        User.create({
          userId,
          email: faker.internet.email(),
          password: hashDriver.hashString(faker.internet.password()),
          role: UserRole.ROOT,
        })
      )
      .onCall(1)
      .resolves();

    await axios
      .delete(`${url}/${faker.string.uuid()}`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("User not found");
      });
  });
});
