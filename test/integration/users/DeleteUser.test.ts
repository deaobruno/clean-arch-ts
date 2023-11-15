import axios from "axios";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UserRole from "../../../src/domain/user/UserRole";
import config from "../../../src/config";
import InMemoryUserRepository from "../../../src/adapters/repositories/inMemory/InMemoryUserRepository";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
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
const url = "http://localhost:8080/api/v1/users";
const email = faker.internet.email();
const password = faker.internet.password();
let Authorization: string;

describe("DELETE /users", () => {
  before(async () => {
    await userRepository.create({
      userId: faker.string.uuid(),
      email,
      password: hashDriver.hashString(password),
      level: UserRole.ADMIN,
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

  it("should get 204 status code when trying to delete an existing user", async () => {
    const {
      data: { id },
    } = await axios.post("http://localhost:8080/api/v1/auth/register", {
      email: faker.internet.email(),
      password,
      confirm_password: password,
    });
    const { status } = await axios.delete(`${url}/${id}`, {
      headers: { Authorization },
    });

    expect(status).equal(204);
  });

  it("should get 400 status code when trying to delete an user passing invalid id", async () => {
    await axios
      .delete(`${url}/test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "user_id" format');
      });
  });

  it("should get 404 status code when trying to delete an user with wrong id", async () => {
    await axios
      .delete(`${url}/${faker.string.uuid()}`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("User not found");
      });
  });
});
