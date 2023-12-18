import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import ValidateAuthentication from "../../../../../src/application/useCases/auth/ValidateAuthentication";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import UnauthorizedError from "../../../../../src/application/errors/UnauthorizedError";
import BaseError from "../../../../../src/application/errors/BaseError";
import RefreshTokenRepository from "../../../../../src/adapters/repositories/RefreshTokenRepository";
import JwtDriver from "../../../../../src/infra/drivers/token/JwtDriver";

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const userData = {
  id: userId,
  email,
  password,
  role: UserRole.CUSTOMER,
};
const fakeUser = {
  userId,
  email,
  password,
  role: UserRole.CUSTOMER,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
};

describe("/application/useCases/auth/ValidateAuthentication.ts", () => {
  afterEach(() => sandbox.restore());

  it("should return authenticated user entity", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository
    );

    tokenDriver.validateAccessToken.returns(userData);
    refreshTokenRepository.findOneByUserId.resolves({
      userId: userId,
      token: "token",
    });
    sandbox.stub(User, "create").returns(fakeUser);

    const authorization = "Bearer token";
    const { user } = <any>await validateAuthentication.exec({ authorization });

    expect(user.userId).equal(userData.id);
    expect(user.email).equal(userData.email);
    expect(user.password).equal(userData.password);
    expect(user.role).equal(userData.role);
    expect(user.isCustomer).equal(true);
    expect(user.isAdmin).equal(false);
    expect(user.isRoot).equal(false);
  });

  it("should return an UnauthorizedError when authentication data is empty", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository
    );

    const authorization = "";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("No token provided");
    expect(error.statusCode).equal(401);
  });

  it("should return an UnauthorizedError when authentication method is not Bearer Token", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository
    );

    const authorization = "test token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("Invalid authentication type");
    expect(error.statusCode).equal(401);
  });

  it("should return an UnauthorizedError when authentication token is empty", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository
    );

    const authorization = "Bearer";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("No token provided");
    expect(error.statusCode).equal(401);
  });

  it("should return an UnauthorizedError when token is expired", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository
    );

    tokenDriver.validateAccessToken.throws({ name: "TokenExpiredError" });

    const authorization = "Bearer token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("Token expired");
    expect(error.statusCode).equal(401);
  });

  it("should return an UnauthorizedError when token is invalid", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository
    );

    tokenDriver.validateAccessToken.throws({});

    const authorization = "Bearer token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("Invalid token");
    expect(error.statusCode).equal(401);
  });

  it("should return an UnauthorizedError when no refresh token is found for user", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const validateAuthentication = new ValidateAuthentication(
      tokenDriver,
      refreshTokenRepository
    );

    tokenDriver.validateAccessToken.returns(userData);
    refreshTokenRepository.findOneByUserId.resolves();

    const authorization = "Bearer token";
    const error = <BaseError>(
      await validateAuthentication.exec({ authorization })
    );

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("Unauthorized");
    expect(error.statusCode).equal(401);
  });
});
