import axios from "axios";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import sinon from "sinon";
import server from "../../../src/infra/http/v1/server";
import config from "../../../src/config";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
import UserRole from "../../../src/domain/user/UserRole";
import MongoDbDriver from "../../../src/infra/drivers/db/MongoDbDriver";

const {
  db: {
    mongo: { dbUrl },
  },
} = config;
const hashDriver = new CryptoDriver();
const dbDriver = MongoDbDriver.getInstance("test");
const url = "http://localhost:8080/api/v1/auth/login";
const email = faker.internet.email();
const password = faker.internet.password();

describe("POST /auth", () => {
  before(async () => {
    await dbDriver.connect(dbUrl);

    server.start(8080);
  });

  afterEach(() => sinon.restore());

  after(async () => {
    await dbDriver.disconnect();

    server.stop();
  });

  it("should get status 200 when successfully authenticated an user", async () => {
    sinon.stub(dbDriver, "findOne").resolves({
      user_id: faker.string.uuid(),
      email,
      password: hashDriver.hashString(password),
      role: UserRole.CUSTOMER,
    });
    sinon.stub(dbDriver, "create").resolves();

    const payload = {
      email,
      password,
    };
    const { status, data } = await axios.post(url, payload);

    expect(status).equal(200);
    expect(typeof data.accessToken).equal("string");
    expect(typeof data.refreshToken).equal("string");
  });

  it('should get status 400 when trying to authenticate an user without "email"', async () => {
    const payload = {
      email: "",
      password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"email" is required');
    });
  });

  it('should get status 400 when trying to authenticate an user with invalid "email"', async () => {
    const payload = {
      email: "test",
      password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('Invalid "email" format');
    });
  });

  it('should get status 400 when trying to authenticate an user without "password"', async () => {
    const payload = {
      email,
      password: "",
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"password" is required');
    });
  });

  it("should get status 400 when trying to authenticate an user with invalid param", async () => {
    const payload = {
      email,
      password,
      test: true,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('Invalid param(s): "test"');
    });
  });

  it("should get status 401 when trying to authenticate an user that does not exist", async () => {
    sinon.stub(dbDriver, "findOne").resolves();

    const payload = {
      email: faker.internet.email(),
      password,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(401);
      expect(data.error).equal("Unauthorized");
    });
  });

  it("should get status 401 when trying to authenticate an existing user with wrong password", async () => {
    sinon.stub(dbDriver, "findOne").resolves({
      user_id: faker.string.uuid(),
      email,
      password: hashDriver.hashString(faker.internet.password()),
      role: UserRole.CUSTOMER,
    });
    const payload = {
      email,
      password: "test",
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(401);
      expect(data.error).equal("Unauthorized");
    });
  });
});
