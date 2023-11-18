import axios from "axios";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import JwtDriver from "../../../src/infra/drivers/token/JwtDriver";
import config from "../../../src/config";
import UserRole from "../../../src/domain/user/UserRole";
import InMemoryRefreshTokenRepository from "../../../src/adapters/repositories/inMemory/InMemoryRefreshTokenRepository";
import InMemoryUserRepository from "../../../src/adapters/repositories/inMemory/InMemoryUserRepository";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
import InMemoryDriver from "../../../src/infra/drivers/db/InMemoryDriver";
import UserMapper from "../../../src/domain/user/UserMapper";
import RefreshTokenMapper from "../../../src/domain/refreshToken/RefreshTokenMapper";
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
const {
  accessTokenSecret,
  accessTokenExpirationTime,
  refreshTokenSecret,
  refreshTokenExpirationTime,
} = config.app;
const jwtDriver = new JwtDriver(
  accessTokenSecret,
  accessTokenExpirationTime,
  refreshTokenSecret,
  refreshTokenExpirationTime
);
const url = "http://localhost:8080/api/v1/auth/refresh-token";
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
let Authorization: string;
let token: string;

describe("POST /auth/refresh-token", () => {
  before(async () => {
    await userRepository.create({
      userId,
      email,
      password: hashDriver.hashString(password),
      role: UserRole.CUSTOMER,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    });

    server.start(8080);
  });

  beforeEach(async () => {
    const {
      data: { accessToken, refreshToken },
    } = await axios.post("http://localhost:8080/api/v1/auth/login", {
      email,
      password,
    });

    Authorization = `Bearer ${accessToken}`;
    token = refreshToken;
  });

  after(async () => {
    await userRepository.delete();
    await refreshTokenRepository.delete();

    server.stop();
  });

  it("should get 200 status code when trying to refresh an access token", async () => {
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
    await axios
      .post(url, { refresh_token: token }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(401);
        expect(data.error).equal("Unauthorized");
      });
  });

  it("should get 403 status code when previous RefreshToken is not found", async () => {
    await axios
      .post(url, { refresh_token: "token" }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403);
        expect(data.error).equal("Refresh token not found");
      });
  });

  it("should get 403 status code when authenticated user is different from token user", async () => {
    const newEmail = faker.internet.email();

    await userRepository.create({
      userId: faker.string.uuid(),
      email: newEmail,
      password: hashDriver.hashString(password),
      role: UserRole.CUSTOMER,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    });

    const {
      data: { refreshToken },
    } = await axios.post("http://localhost:8080/api/v1/auth/login", {
      email: newEmail,
      password,
    });

    await axios
      .post(
        url,
        { refresh_token: refreshToken },
        { headers: { Authorization } }
      )
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403);
        expect(data.error).equal("Token does not belong to user");
      });
  });

  it("should get 403 status code when refresh token is expired", async () => {
    const userData = {
      id: userId,
      email,
      password,
      role: UserRole.CUSTOMER,
    };
    const expiredToken = jwtDriver.generateRefreshToken(userData, -10);

    await refreshTokenRepository.create({
      userId,
      token: expiredToken,
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
    const userData = {
      id: userId,
      email,
      password,
      role: UserRole.CUSTOMER,
    };
    const invalidToken = jwt.sign(userData, "invalid-key");

    await refreshTokenRepository.create({
      userId,
      token: invalidToken,
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
