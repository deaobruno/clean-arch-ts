import axios from "axios";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import config from "../../../src/config";
import InMemoryUserRepository from "../../../src/adapters/repositories/inMemory/InMemoryUserRepository";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
import UserRole from "../../../src/domain/user/UserRole";
import InMemoryDriver from "../../../src/infra/drivers/db/InMemoryDriver";
import UserMapper from "../../../src/domain/user/UserMapper";
import RefreshTokenMapper from "../../../src/domain/refreshToken/RefreshTokenMapper";
import InMemoryRefreshTokenRepository from "../../../src/adapters/repositories/inMemory/InMemoryRefreshTokenRepository";
import server from "../../../src/infra/http/v1/server";

const dbDriver = InMemoryDriver.getInstance();
const userMapper = new UserMapper();
const refreshTokenMapper = new RefreshTokenMapper();
const userRepository = new InMemoryUserRepository(
  config.db.usersSource,
  dbDriver,
  userMapper
);
const refreshTokenRepository = new InMemoryRefreshTokenRepository(
  config.db.refreshTokensSource,
  dbDriver,
  refreshTokenMapper
);
const hashDriver = new CryptoDriver();
const url = "http://localhost:8080/api/v1/users/create-admin";
const email = faker.internet.email();
const password = faker.internet.password();
let Authorization: string;

describe("POST /users/create-admin", () => {
  before(async () => {
    await userRepository.create({
      userId: faker.string.uuid(),
      email,
      password: hashDriver.hashString(password),
      role: UserRole.ADMIN,
      isRoot: false,
      isAdmin: true,
      isCustomer: false,
    });

    server.start(8080);

    const {
      data: { accessToken },
    } = await axios.post("http://localhost:8080/api/v1/auth/login", {
      email,
      password,
    });

    Authorization = `Bearer ${accessToken}`;
  });

  after(async () => {
    await userRepository.delete();
    await refreshTokenRepository.delete();

    server.stop();
  });

  it("should get status 201 when successfully registered a new admin", async () => {
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
    const payload = {
      email: "",
      password,
      confirm_password: password,
    };

    await axios
      .post(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"email" is required');
      });
  });

  it('should get status 400 when trying to register an admin with invalid "email"', async () => {
    const payload = {
      email: "test",
      password,
      confirm_password: password,
    };

    await axios
      .post(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "email" format');
      });
  });

  it('should get status 400 when trying to register an admin without "password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: "",
      confirm_password: password,
    };

    await axios
      .post(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"password" is required');
      });
  });

  it('should get status 400 when trying to register an admin without "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: "",
    };

    await axios
      .post(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('"confirm_password" is required');
      });
  });

  it('should get status 400 when trying to register an admin with different "password" and "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: "test",
    };

    await axios
      .post(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal("Passwords mismatch");
      });
  });

  it("should get status 400 when trying to register a admin with invalid param", async () => {
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: password,
      test: true,
    };

    await axios
      .post(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid param(s): "test"');
      });
  });

  it("should get status 409 when trying to register an admin with a previously registered email", async () => {
    const payload = {
      email,
      password,
      confirm_password: password,
    };

    await axios
      .post(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(409);
        expect(data.error).equal("Email already in use");
      });
  });
});
