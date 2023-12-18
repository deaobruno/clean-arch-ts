import sinon from "sinon";
import axios from "axios";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import config from "../../../src/config";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
import server from "../../../src/infra/http/v1/server";
import MongoDbDriver from "../../../src/infra/drivers/db/MongoDbDriver";
import UserRole from "../../../src/domain/user/UserRole";
import JwtDriver from "../../../src/infra/drivers/token/JwtDriver";

const {
  db: {
    mongo: { dbUrl, dbName },
  },
} = config;
const sandbox = sinon.createSandbox();
const dbDriver = MongoDbDriver.getInstance(dbName);
const hashDriver = new CryptoDriver();
const url = "http://localhost:8080/api/v1/users/create-admin";
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.ADMIN;
const Authorization = "Bearer token";
const token = "refresh-token";

describe("POST /users/create-admin", () => {
  before(async () => {
    await dbDriver.connect(dbUrl);

    server.start(8080);
  });

  afterEach(() => sandbox.restore());

  after(async () => {
    await dbDriver.disconnect();

    server.stop();
  });

  it("should get status 201 when successfully registered a new admin", async () => {
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
      .resolves();
    sandbox.stub(dbDriver, "create").resolves();

    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: password,
    };
    const { status, data } = await axios.post(url, payload, {
      headers: { Authorization },
    });

    expect(status).equal(201);
    expect(typeof data.id).equal("string");
    expect(data.email).equal(payload.email);
  });

  it('should get status 400 when trying to register an admin without "email"', async () => {
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

    const payload = {
      email: "",
      password,
      confirm_password: password,
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"email" is required');
      });
  });

  it('should get status 400 when trying to register an admin with invalid "email"', async () => {
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

    const payload = {
      email: "test",
      password,
      confirm_password: password,
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "email" format');
      });
  });

  it('should get status 400 when trying to register an admin without "password"', async () => {
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

    const payload = {
      email: faker.internet.email(),
      password: "",
      confirm_password: password,
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"password" is required');
      });
  });

  it('should get status 400 when trying to register an admin without "confirm_password"', async () => {
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

    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: "",
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"confirm_password" is required');
      });
  });

  it('should get status 400 when trying to register an admin with different "password" and "confirm_password"', async () => {
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

    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: "test",
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal("Passwords mismatch");
      });
  });

  it("should get status 400 when trying to register a admin with invalid param", async () => {
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

    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: password,
      test: true,
    };

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid param(s): "test"');
      });
  });

  it("should get status 409 when trying to register an admin with a previously registered email", async () => {
    const email = faker.internet.email();
    const password = "12345";
    const payload = {
      email,
      password,
      confirm_password: password,
    };

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
    sandbox.stub(dbDriver, "create").resolves({
      user_id: faker.string.uuid(),
      email,
      password: hashDriver.hashString(password),
    });

    await axios
      .post(url, payload, {
        headers: { Authorization },
      })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(409);
        expect(data.error).equal("Email already in use");
      });
  });
});
