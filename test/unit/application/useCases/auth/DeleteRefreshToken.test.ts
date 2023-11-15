import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import IRefreshTokenRepository from "../../../../../src/domain/refreshToken/IRefreshTokenRepository";
import RefreshTokenRepositoryMock from "../../../../mocks/repositories/inMemory/InMemoryRefreshTokenRepositoryMock";
import BaseError from "../../../../../src/application/errors/BaseError";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import DeleteRefreshToken from "../../../../../src/application/useCases/auth/DeleteRefreshToken";
import UserRole from "../../../../../src/domain/user/UserRole";
import ForbiddenError from "../../../../../src/application/errors/ForbiddenError";

const sandbox = sinon.createSandbox();
const refreshTokenRepository: IRefreshTokenRepository =
  RefreshTokenRepositoryMock;
const deleteRefreshToken = new DeleteRefreshToken(refreshTokenRepository);
const user = {
  userId: faker.string.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  level: UserRole.CUSTOMER,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
};
let notFoundError: BaseError;

describe("/application/useCases/auth/DeleteRefreshToken.ts", () => {
  before(() => {
    notFoundError = sandbox.stub(NotFoundError.prototype);
    notFoundError.name = "NotFoundError";
    notFoundError.statusCode = 401;
    notFoundError.message = "Not Found";
  });

  afterEach(() => sandbox.restore());

  it("should delete a refresh token", async () => {
    sandbox
      .stub(refreshTokenRepository, "findOneByToken")
      .resolves({ userId: user.userId, token: "token" });

    expect(
      await deleteRefreshToken.exec({ user, refresh_token: "token" })
    ).equal(undefined);
  });

  it("should return NotFoundError when refresh token is not found", async () => {
    const error = <BaseError>(
      await deleteRefreshToken.exec({ user, refresh_token: "token" })
    );

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal("Refresh token not found");
    expect(error.statusCode).equal(404);
  });

  it("should return ForbiddenError when authenticated user is different from token user", async () => {
    sandbox
      .stub(refreshTokenRepository, "findOneByToken")
      .resolves({ userId: faker.string.uuid(), token: "token" });

    const error = <BaseError>(
      await deleteRefreshToken.exec({ user, refresh_token: "token" })
    );

    expect(error instanceof ForbiddenError).equal(true);
    expect(error.message).equal("Token does not belong to user");
    expect(error.statusCode).equal(403);
  });
});
