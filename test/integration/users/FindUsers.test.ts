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
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.ROOT;
const usersData = [
  {
    user_id: faker.string.uuid(),
    email: faker.internet.email(),
    password: hashDriver.hashString(faker.internet.password()),
    role: UserRole.CUSTOMER,
  },
  {
    user_id: faker.string.uuid(),
    email: faker.internet.email(),
    password: hashDriver.hashString(faker.internet.password()),
    role: UserRole.CUSTOMER,
  },
  {
    user_id: faker.string.uuid(),
    email: faker.internet.email(),
    password: hashDriver.hashString(faker.internet.password()),
    role: UserRole.CUSTOMER,
  },
];
const Authorization = "Bearer token";
const token = "refresh-token";

describe("GET /users", () => {
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

  it("should get 200 status code and an array with users data when trying to find users without filters", async () => {
    const userId = faker.string.uuid();

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
        password,
        role,
      });
    sandbox.stub(dbDriver, "find").resolves(usersData);

    const { status, data } = await axios.get(`${url}`, {
      headers: { Authorization, "Content-Type": "application/json" },
    });

    expect(status).equal(200);
    expect(data.length).equal(3);
    expect(data[0].id).equal(usersData[0].user_id);
    expect(data[0].email).equal(usersData[0].email);
    expect(data[0].role).equal(UserRole[usersData[0].role]);
    expect(data[1].id).equal(usersData[1].user_id);
    expect(data[1].email).equal(usersData[1].email);
    expect(data[1].role).equal(UserRole[usersData[1].role]);
    expect(data[2].id).equal(usersData[2].user_id);
    expect(data[2].email).equal(usersData[2].email);
    expect(data[2].role).equal(UserRole[usersData[2].role]);
  });

  it("should get 200 status code and an array with users data when trying to find users with filters", async () => {
    const userId = faker.string.uuid();

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
        password,
        role,
      });
    sandbox.stub(dbDriver, "find").resolves([usersData[0]]);

    const { status, data } = await axios.get(
      `${url}?email=${usersData[0].email}`,
      { headers: { Authorization, "Content-Type": "application/json" } }
    );

    expect(status).equal(200);
    expect(data.length).equal(1);
    expect(data[0].id).equal(usersData[0].user_id);
    expect(data[0].email).equal(usersData[0].email);
    expect(data[0].role).equal(UserRole[usersData[0].role]);
  });

  it('should get 400 status code when trying to find users passing empty "email" as filter', async () => {
    const userId = faker.string.uuid();

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
        password,
        role,
      });

    await axios
      .get(`${url}?email=`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"email" is required');
      });
  });

  it('should get 400 status code when trying to find users passing invalid "email" as filter', async () => {
    const userId = faker.string.uuid();

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
        password,
        role,
      });

    await axios
      .get(`${url}?email=test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "email" format');
      });
  });

  it("should get 400 status code when trying to find users passing invalid param as filter", async () => {
    const userId = faker.string.uuid();

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
        password,
        role,
      });

    await axios
      .get(`${url}?test=test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(`Invalid param(s): "test"`);
      });
  });

  it("should get 404 status code when no users are found", async () => {
    const userId = faker.string.uuid();

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
        password,
        role,
      });
    sandbox.stub(dbDriver, "find").resolves([]);

    await axios
      .get(`${url}?email=test@test.com`, {
        headers: { Authorization, "Content-Type": "application/json" },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("Users not found");
      });
  });
});
