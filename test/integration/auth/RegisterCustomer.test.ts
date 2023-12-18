import sinon from "sinon";
import axios from "axios";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import config from "../../../src/config";
import MongoDbDriver from "../../../src/infra/drivers/db/MongoDbDriver";
import server from "../../../src/infra/http/v1/server";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
import UserRole from "../../../src/domain/user/UserRole";

const {
  db: {
    mongo: { dbUrl, dbName },
  },
} = config;
const sandbox = sinon.createSandbox();
const cryptoDriver = new CryptoDriver();
const dbDriver = MongoDbDriver.getInstance(dbName);
const url = "http://localhost:8080/api/v1/auth/register";

describe("POST /auth/register", () => {
  before(async () => {
    await dbDriver.connect(dbUrl);

    server.start(8080);
  });

  afterEach(() => sandbox.restore());

  after(async () => {
    await dbDriver.disconnect();

    server.stop();
  });

  it("should get status 201 when successfully registered a new customer", async () => {
    sandbox.stub(dbDriver, "findOne").resolves();
    sandbox.stub(dbDriver, "create").resolves();

    const payload = {
      email: faker.internet.email(),
      password: "12345",
      confirm_password: "12345",
    };
    const { status, data } = await axios.post(url, payload);

    expect(status).equal(201);
    expect(typeof data.id).equal("string");
    expect(data.email).equal(payload.email);
  });

  it('should get status 400 when trying to register a customer without "email"', async () => {
    const payload = {
      email: "",
      password: "12345",
      confirm_password: "12345",
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"email" is required');
    });
  });

  it('should get status 400 when trying to register a customer with invalid "email"', async () => {
    const payload = {
      email: "test",
      password: "12345",
      confirm_password: "12345",
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('Invalid "email" format');
    });
  });

  it('should get status 400 when trying to register a customer without "password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: "",
      confirm_password: "12345",
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"password" is required');
    });
  });

  it('should get status 400 when trying to register a customer without "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: "12345",
      confirm_password: "",
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('"confirm_password" is required');
    });
  });

  it('should get status 400 when trying to register a customer with different "password" and "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: "12345",
      confirm_password: "1234",
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal("Passwords mismatch");
    });
  });

  it("should get status 400 when trying to register a customer with invalid param", async () => {
    const payload = {
      email: faker.internet.email(),
      password: "12345",
      confirm_password: "12345",
      test: true,
    };

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(400);
      expect(data.error).equal('Invalid param(s): "test"');
    });
  });

  it("should get status 409 when trying to register a customer with an previously registered email", async () => {
    const email = faker.internet.email();
    const password = "12345";
    const payload = {
      email,
      password,
      confirm_password: password,
    };

    sandbox.stub(dbDriver, "findOne").resolves({
      user_id: faker.string.uuid(),
      email,
      password: cryptoDriver.hashString(password),
      role: UserRole.CUSTOMER,
    });
    sandbox.stub(dbDriver, "create").resolves({
      user_id: faker.string.uuid(),
      email,
      password: cryptoDriver.hashString(password),
    });

    await axios.post(url, payload).catch(({ response: { status, data } }) => {
      expect(status).equal(409);
      expect(data.error).equal("Email already in use");
    });
  });
});
