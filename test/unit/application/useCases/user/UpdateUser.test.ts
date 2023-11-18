import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import UpdateUser from "../../../../../src/application/useCases/user/UpdateUser";
import IUserRepository from "../../../../../src/domain/user/IUserRepository";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import BaseError from "../../../../../src/application/errors/BaseError";
import IRefreshTokenRepository from "../../../../../src/domain/refreshToken/IRefreshTokenRepository";
import UserRepositoryMock from "../../../../mocks/repositories/inMemory/InMemoryUserRepositoryMock";
import RefreshTokenRepositoryMock from "../../../../mocks/repositories/inMemory/InMemoryRefreshTokenRepositoryMock";

const sandbox = sinon.createSandbox();
const userRepository: IUserRepository = UserRepositoryMock;
const refreshTokenRepository: IRefreshTokenRepository =
  RefreshTokenRepositoryMock;
const updateUser: UpdateUser = new UpdateUser(
  userRepository,
  refreshTokenRepository
);
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = {
  userId,
  email,
  password,
  role: UserRole.CUSTOMER,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
};
let notFoundError: NotFoundError;

describe("/application/useCases/user/UpdateUser.ts", () => {
  beforeEach(() => {
    notFoundError = sandbox.stub(NotFoundError.prototype);
    notFoundError.name = "NotFoundError";
    notFoundError.statusCode = 404;
    notFoundError.message = "User not found";
  });

  afterEach(() => sandbox.restore());

  it("should update an existing user", async () => {
    sandbox.stub(userRepository, "findOne").resolves(fakeUser);

    const newEmail = faker.internet.email();

    fakeUser.email = newEmail;

    sandbox.stub(userRepository, "update").resolves();

    const updateData = {
      user_id: userId,
      email: newEmail,
    };
    const user = <User>await updateUser.exec({ user: fakeUser, ...updateData });

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(newEmail);
    expect(user.password).equal(fakeUser.password);
    expect(user.role).equal(fakeUser.role);
    expect(user.isCustomer).equal(true);
    expect(user.isAdmin).equal(false);
    expect(user.isRoot).equal(false);
  });

  it("should fail when trying to update an user passing wrong ID", async () => {
    fakeUser.userId = "test";

    const error = <BaseError>(
      await updateUser.exec({ user: fakeUser, user_id: "test" })
    );

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal("User not found");
    expect(error.statusCode).equal(404);
  });

  it("should return a NotFoundError when authenticated user is different from found user", async () => {
    fakeUser.userId = faker.string.uuid();

    const error = <BaseError>(
      await updateUser.exec({ user: fakeUser, user_id: userId })
    );

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal("User not found");
    expect(error.statusCode).equal(404);
  });
});
