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
  {
    user_id: userId,
    email,
    password: hashDriver.hashString(password),
    role,
  },
];
const Authorization = "Bearer token";
const token = "refresh-token";

describe("GET /users", () => {
  before(async () => {
    await dbDriver.connect(dbUrl);

    server.start(8080);
  });

  afterEach(() => sandbox.restore());

  after(async () => {
    await dbDriver.disconnect();

    server.stop();
  });

  it("should get 200 status code and an array with users data when trying to find users without filters", async () => {
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
    sandbox
      .stub(MongoDbDriver.prototype, "find")
      .onCall(0)
      .resolves(usersData)
      .onCall(1)
      .resolves([])
      .onCall(2)
      .resolves([])
      .onCall(3)
      .resolves([]);

    const { status, data } = await axios.get(`${url}`, {
      headers: { Authorization },
    });

    expect(status).equal(200);
    expect(data.length).equal(3);
    expect(typeof data[0].id).equal("string");
    expect(data[0].email).equal(usersData[0].email);
    expect(typeof data[1].id).equal("string");
    expect(data[1].email).equal(usersData[1].email);
    expect(typeof data[2].id).equal("string");
    expect(data[2].email).equal(usersData[2].email);
  });

  it("should get 200 status code and an array with users data when trying to find users with filters", async () => {
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
    sandbox
      .stub(MongoDbDriver.prototype, "find")
      .onFirstCall()
      .resolves([usersData[0]])
      .onSecondCall()
      .resolves([]);

    const { status, data } = await axios.get(
      `${url}?email=${usersData[0].email}`,
      { headers: { Authorization } }
    );

    expect(status).equal(200);
    expect(data.length).equal(1);
    expect(typeof data[0].id).equal("string");
    expect(data[0].email).equal(usersData[0].email);
  });

  it('should get 400 status code when trying to find users passing empty "email" as filter', async () => {
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

    await axios
      .get(`${url}?email=`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"email" is required');
      });
  });

  it('should get 400 status code when trying to find users passing invalid "email" as filter', async () => {
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

    await axios
      .get(`${url}?email=test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "email" format');
      });
  });

  it("should get 400 status code when trying to find users passing invalid param as filter", async () => {
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

    await axios
      .get(`${url}?test=test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal(`Invalid param(s): "test"`);
      });
  });

  it("should get 404 status code when no users are found", async () => {
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
    sandbox.stub(MongoDbDriver.prototype, "find").resolves([]);

    await axios
      .get(`${url}?email=test@test.com`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("Users not found");
      });
  });
});
