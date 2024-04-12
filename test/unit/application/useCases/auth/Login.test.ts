import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import JwtDriver from "../../../../../src/infra/drivers/token/JwtDriver";
import CryptoDriver from "../../../../../src/infra/drivers/hash/CryptoDriver";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";
import RefreshTokenRepository from "../../../../../src/adapters/repositories/RefreshTokenRepository";
import Login from "../../../../../src/application/useCases/auth/Login";
import BaseError from "../../../../../src/application/errors/BaseError";
import UnauthorizedError from "../../../../../src/application/errors/UnauthorizedError";
import RefreshToken from "../../../../../src/domain/refreshToken/RefreshToken";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const userData = {
  userId,
  email,
  password,
  role: UserRole.CUSTOMER,
};
const fakeUser = User.create({
  userId,
  email,
  password: "hash",
  role: UserRole.CUSTOMER,
});

describe("/application/useCases/auth/Login.ts", () => {
  afterEach(() => sandbox.restore());

  it("should return a JWT access token and a JWT refresh token", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );

    userRepository.findOneByEmail.resolves(fakeUser);
    hashDriver.hashString.returns(fakeUser.password);
    tokenDriver.generateAccessToken.returns("access-token");
    tokenDriver.generateRefreshToken.returns("refresh-token");
    sandbox
      .stub(RefreshToken, "create")
      .returns({ userId: faker.string.uuid(), token: "token" });

    const login = new Login(
      userRepository,
      refreshTokenRepository,
      tokenDriver,
      hashDriver
    );

    const { accessToken, refreshToken } = <any>(
      await login.exec(userData)
    );

    expect(accessToken).equal("access-token");
    expect(refreshToken).equal("refresh-token");
  });

  it("should return an UnauthorizedError when user is not found", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );

    const login = new Login(
      userRepository,
      refreshTokenRepository,
      tokenDriver,
      hashDriver
    );

    const error = <BaseError>await login.exec(userData);

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("Unauthorized");
    expect(error.statusCode).equal(401);
  });

  it("should return an UnauthorizedError when given password is different from found user password", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );

    fakeUser.password = "test";
    userRepository.findOneByEmail.resolves(fakeUser);

    const login = new Login(
      userRepository,
      refreshTokenRepository,
      tokenDriver,
      hashDriver
    );

    const error = <BaseError>await login.exec(userData);

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("Unauthorized");
    expect(error.statusCode).equal(401);
  });
});
