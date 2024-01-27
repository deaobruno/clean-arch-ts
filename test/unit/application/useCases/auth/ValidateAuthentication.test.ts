import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import ValidateAuthentication from "../../../../../src/application/useCases/auth/ValidateAuthentication";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import UnauthorizedError from "../../../../../src/application/errors/UnauthorizedError";
import BaseError from "../../../../../src/application/errors/BaseError";
import RefreshTokenRepository from "../../../../../src/adapters/repositories/RefreshTokenRepository";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";
import JwtDriver from "../../../../../src/infra/drivers/token/JwtDriver";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import ForbiddenError from "../../../../../src/application/errors/ForbiddenError";

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.CUSTOMER;
const userData = {
  id: userId,
};
const fakeUser = User.create({
  userId,
  email,
  password,
  role,
});

describe("/application/useCases/auth/ValidateAuthentication.ts", () => {
  afterEach(() => sandbox.restore());

  it("should return authenticated user entity", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const userRepository = sandbox.createStubInstance(UserRepository);
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository,
      userRepository
    );

    tokenDriver.validateAccessToken.returns(userData);
    refreshTokenRepository.findOneByUserId.resolves({
      userId: userId,
      token: "token",
    });
    userRepository.findOneById.resolves(fakeUser);

    const authorization = "Bearer token";
    const { user, refreshToken } = <any>(
      await validateAuthentication.exec({ authorization })
    );

    expect(user.userId).equal(userId);
    expect(user.email).equal(email);
    expect(user.password).equal(password);
    expect(user.role).equal(role);
    expect(user.isCustomer).equal(true);
    expect(user.isRoot).equal(false);
    expect(refreshToken.userId).equal(userId);
    expect(refreshToken.token).equal("token");
  });

  it("should return an UnauthorizedError when authentication data is empty", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const userRepository = sandbox.createStubInstance(UserRepository);
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository,
      userRepository
    );

    const authorization = "";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error).deep.equal(new UnauthorizedError("No token provided"));
  });

  it("should return an UnauthorizedError when authentication method is not Bearer Token", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const userRepository = sandbox.createStubInstance(UserRepository);
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository,
      userRepository
    );

    const authorization = "test token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error).deep.equal(
      new UnauthorizedError("Invalid authentication type")
    );
  });

  it("should return an UnauthorizedError when authentication token is empty", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const userRepository = sandbox.createStubInstance(UserRepository);
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository,
      userRepository
    );

    const authorization = "Bearer";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error).deep.equal(new UnauthorizedError("No token provided"));
  });

  it("should return an UnauthorizedError when token is expired", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const userRepository = sandbox.createStubInstance(UserRepository);
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository,
      userRepository
    );

    tokenDriver.validateAccessToken.throws({ name: "TokenExpiredError" });

    const authorization = "Bearer token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error).deep.equal(new UnauthorizedError("Token expired"));
  });

  it("should return an UnauthorizedError when token is invalid", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const userRepository = sandbox.createStubInstance(UserRepository);
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository,
      userRepository
    );

    tokenDriver.validateAccessToken.throws({});

    const authorization = "Bearer token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error).deep.equal(new UnauthorizedError("Invalid token"));
  });

  it("should return an UnauthorizedError when no refresh token is found for user", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const userRepository = sandbox.createStubInstance(UserRepository);
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository,
      userRepository
    );

    tokenDriver.validateAccessToken.returns(userData);
    refreshTokenRepository.findOneByUserId.resolves();

    const authorization = "Bearer token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error).deep.equal(new UnauthorizedError("Unauthorized"));
  });

  it("should return a NotFoundError when user is not found", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const userRepository = sandbox.createStubInstance(UserRepository);
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository,
      userRepository
    );

    tokenDriver.validateAccessToken.returns(userData);
    refreshTokenRepository.findOneByUserId.resolves({
      userId: userId,
      token: "token",
    });
    userRepository.findOneById.resolves();

    const authorization = "Bearer token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error).deep.equal(new NotFoundError("User not found"));
  });

  it("should return a ForbiddenError when request token does not belong to user", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const userRepository = sandbox.createStubInstance(UserRepository);
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository,
      userRepository
    );

    tokenDriver.validateAccessToken.returns(userData);
    refreshTokenRepository.findOneByUserId.resolves({
      userId: faker.string.uuid(),
      token: "token",
    });
    userRepository.findOneById.resolves(fakeUser);

    const authorization = "Bearer token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error).deep.equal(
      new ForbiddenError("Token does not belong to user")
    );
  });
});
