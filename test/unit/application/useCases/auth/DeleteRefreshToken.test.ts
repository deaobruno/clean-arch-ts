import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import RefreshTokenRepository from "../../../../../src/adapters/repositories/RefreshTokenRepository";
import BaseError from "../../../../../src/application/errors/BaseError";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import DeleteRefreshToken from "../../../../../src/application/useCases/auth/DeleteRefreshToken";
import UserRole from "../../../../../src/domain/user/UserRole";
import ForbiddenError from "../../../../../src/application/errors/ForbiddenError";
import User from "../../../../../src/domain/user/User";

const sandbox = sinon.createSandbox();
const user = User.create({
  userId: faker.string.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: UserRole.CUSTOMER,
});

describe("/application/useCases/auth/DeleteRefreshToken.ts", () => {
  afterEach(() => sandbox.restore());

  it("should delete a refresh token", async () => {
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const deleteRefreshToken = new DeleteRefreshToken(refreshTokenRepository);

    refreshTokenRepository.findOneByUserId.resolves({
      userId: user.userId,
      token: "token",
    });

    expect(await deleteRefreshToken.exec({ user })).equal(undefined);
  });

  it("should return NotFoundError when refresh token is not found", async () => {
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const deleteRefreshToken = new DeleteRefreshToken(refreshTokenRepository);
    const error = <BaseError>await deleteRefreshToken.exec({ user });

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal("Refresh token not found");
    expect(error.statusCode).equal(404);
  });

  it("should return ForbiddenError when authenticated user is different from token user", async () => {
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const deleteRefreshToken = new DeleteRefreshToken(refreshTokenRepository);

    refreshTokenRepository.findOneByUserId.resolves({
      userId: faker.string.uuid(),
      token: "token",
    });

    const error = <BaseError>await deleteRefreshToken.exec({ user });

    expect(error instanceof ForbiddenError).equal(true);
    expect(error.message).equal("Token does not belong to user");
    expect(error.statusCode).equal(403);
  });
});
