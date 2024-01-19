import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import RefreshAccessToken from "../../../../../src/application/useCases/auth/RefreshAccessToken";
import BaseError from "../../../../../src/application/errors/BaseError";
import RefreshTokenRepository from "../../../../../src/adapters/repositories/RefreshTokenRepository";
import UserRole from "../../../../../src/domain/user/UserRole";
import ForbiddenError from "../../../../../src/application/errors/ForbiddenError";
import JwtDriver from "../../../../../src/infra/drivers/token/JwtDriver";
import RefreshToken from "../../../../../src/domain/refreshToken/RefreshToken";
import User from "../../../../../src/domain/user/User";

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const userData = {
  userId,
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: UserRole.CUSTOMER,
};
const user = User.create(userData);

describe("/application/useCases/auth/RefreshAccessToken.ts", () => {
  afterEach(() => sandbox.restore());

  it("should return a JWT access token", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const refreshAccessToken = new RefreshAccessToken(
      tokenDriver,
      refreshTokenRepository
    );

    refreshTokenRepository.findOneByUserId.resolves({
      userId,
      token: "refresh-token",
    });
    tokenDriver.validateRefreshToken.returns(userData);
    refreshTokenRepository.deleteAllByUserId.resolves();
    tokenDriver.generateAccessToken.returns("access-token");
    tokenDriver.generateRefreshToken.returns("refresh-token");
    sandbox
      .stub(RefreshToken, "create")
      .returns({ userId: faker.string.uuid(), token: "token" });
    refreshTokenRepository.create.resolves();

    const { accessToken } = <any>(
      await refreshAccessToken.exec({ user, refresh_token: "refresh-token" })
    );

    expect(typeof accessToken).equal("string");
  });

  it("should fail when there is no previous refresh token", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const refreshAccessToken = new RefreshAccessToken(
      tokenDriver,
      refreshTokenRepository
    );

    refreshTokenRepository.findOneByUserId.resolves();

    const error = <BaseError>(
      await refreshAccessToken.exec({ user, refresh_token: "refresh-token" })
    );

    expect(error instanceof ForbiddenError).equal(true);
    expect(error.message).equal("Refresh token not found");
    expect(error.statusCode).equal(403);
  });

  it("should fail when refresh token is expired", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const refreshAccessToken = new RefreshAccessToken(
      tokenDriver,
      refreshTokenRepository
    );

    refreshTokenRepository.findOneByUserId.resolves({
      userId,
      token: "refresh-token",
    });
    tokenDriver.validateRefreshToken.throws({ name: "TokenExpiredError" });

    const error = <BaseError>(
      await refreshAccessToken.exec({ user, refresh_token: "refresh-token" })
    );

    expect(error instanceof ForbiddenError).equal(true);
    expect(error.message).equal("Refresh token expired");
    expect(error.statusCode).equal(403);
  });

  it("should fail when refresh token is invalid", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const refreshAccessToken = new RefreshAccessToken(
      tokenDriver,
      refreshTokenRepository
    );

    refreshTokenRepository.findOneByUserId.resolves({
      userId,
      token: "refresh-token",
    });
    tokenDriver.validateRefreshToken.throws({});

    const error = <BaseError>(
      await refreshAccessToken.exec({ user, refresh_token: "refresh-token" })
    );

    expect(error instanceof ForbiddenError).equal(true);
    expect(error.message).equal("Invalid refresh token");
    expect(error.statusCode).equal(403);
  });

  it("should return ForbiddenError when authenticated user is different from token user", async () => {
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const refreshAccessToken = new RefreshAccessToken(
      tokenDriver,
      refreshTokenRepository
    );

    refreshTokenRepository.findOneByUserId.resolves({
      userId: faker.string.uuid(),
      token: "refresh-token",
    });

    const error = <BaseError>(
      await refreshAccessToken.exec({ user, refresh_token: "refresh-token" })
    );

    expect(error instanceof ForbiddenError).equal(true);
    expect(error.message).equal("Token does not belong to user");
    expect(error.statusCode).equal(403);
  });
});
