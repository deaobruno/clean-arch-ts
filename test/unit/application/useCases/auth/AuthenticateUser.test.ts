import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import ITokenDriver from "../../../../../src/infra/drivers/token/ITokenDriver";
import IHashDriver from "../../../../../src/infra/drivers/hash/IHashDriver";
import IUserRepository from "../../../../../src/domain/user/IUserRepository";
import IRefreshTokenRepository from "../../../../../src/domain/refreshToken/IRefreshTokenRepository";
import TokenDriverMock from "../../../../mocks/drivers/TokenDriverMock";
import HashDriverMock from "../../../../mocks/drivers/HashDriverMock";
import UserRepositoryMock from "../../../../mocks/repositories/inMemory/InMemoryUserRepositoryMock";
import RefreshTokenRepositoryMock from "../../../../mocks/repositories/inMemory/InMemoryRefreshTokenRepositoryMock";
import BaseError from "../../../../../src/application/errors/BaseError";
import UnauthorizedError from "../../../../../src/application/errors/UnauthorizedError";
import AuthenticateUser from "../../../../../src/application/useCases/auth/AuthenticateUser";
import RefreshToken from "../../../../../src/domain/refreshToken/RefreshToken";
import UserRole from "../../../../../src/domain/user/UserRole";

const sandbox = sinon.createSandbox();
const tokenDriver: ITokenDriver = TokenDriverMock;
const cryptoDriver: IHashDriver = HashDriverMock;
const userRepository: IUserRepository = UserRepositoryMock;
const refreshTokenRepository: IRefreshTokenRepository =
  RefreshTokenRepositoryMock;
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const userData = {
  userId,
  email,
  password,
  level: UserRole.CUSTOMER,
};
const fakeUser = {
  userId,
  email,
  password: "hash",
  level: UserRole.CUSTOMER,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
};
const authenticateUser = new AuthenticateUser(
  userRepository,
  refreshTokenRepository,
  tokenDriver,
  cryptoDriver
);
let unauthorizedError: BaseError;

describe("/application/useCases/auth/AuthenticateUser.ts", () => {
  before(() => {
    unauthorizedError = sandbox.stub(UnauthorizedError.prototype);
    unauthorizedError.name = "UnauthorizedError";
    unauthorizedError.statusCode = 401;
    unauthorizedError.message = "Unauthorized";
  });

  afterEach(() => sandbox.restore());

  it("should return a JWT access token and a JWT refresh token", async () => {
    sandbox.stub(UserRepositoryMock, "findOneByEmail").resolves(fakeUser);
    sandbox
      .stub(RefreshToken, "create")
      .returns({ userId: faker.string.uuid(), token: "token" });

    const { accessToken, refreshToken } = <any>(
      await authenticateUser.exec(userData)
    );

    expect(typeof accessToken).equal("string");
    expect(typeof refreshToken).equal("string");
  });

  it("should return an UnauthorizedError when user is not found", async () => {
    const error = <BaseError>await authenticateUser.exec(userData);

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("Unauthorized");
    expect(error.statusCode).equal(401);
  });

  it("should return an UnauthorizedError when given password is different from found user password", async () => {
    fakeUser.password = "test";

    sandbox.stub(UserRepositoryMock, "findOneByEmail").resolves(fakeUser);

    const error = <BaseError>await authenticateUser.exec(userData);

    expect(error instanceof UnauthorizedError).equal(true);
    expect(error.message).equal("Unauthorized");
    expect(error.statusCode).equal(401);
  });
});
