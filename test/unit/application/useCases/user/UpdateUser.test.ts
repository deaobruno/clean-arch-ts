import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import UpdateUser from "../../../../../src/application/useCases/user/UpdateUser";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import BaseError from "../../../../../src/application/errors/BaseError";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";
import RefreshTokenRepository from "../../../../../src/adapters/repositories/RefreshTokenRepository";
import MemoRepository from "../../../../../src/adapters/repositories/MemoRepository";

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = User.create({
  userId,
  email,
  password,
  role: UserRole.CUSTOMER,
});

describe("/application/useCases/user/UpdateUser.ts", () => {
  afterEach(() => sandbox.restore());

  it("should update an existing user", async () => {
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const updateUser = new UpdateUser(
      userRepository,
      refreshTokenRepository,
      memoRepository
    );

    userRepository.findOne.resolves(fakeUser);
    userRepository.update.resolves();
    refreshTokenRepository.delete.resolves();
    memoRepository.findByUserId.resolves([]);

    const newEmail = faker.internet.email();

    fakeUser.email = newEmail;

    userRepository.update.resolves();

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
    expect(user.isRoot).equal(false);
  });

  it("should fail when trying to update an user passing wrong ID", async () => {
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const updateUser = new UpdateUser(
      userRepository,
      refreshTokenRepository,
      memoRepository
    );

    const error = <BaseError>await updateUser.exec({
      user: User.create({
        userId: faker.string.uuid(),
        email,
        password,
        role: UserRole.CUSTOMER,
      }),
      user_id: "test",
    });

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal("User not found");
    expect(error.statusCode).equal(404);
  });

  it("should return a NotFoundError when authenticated user is different from found user", async () => {
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const updateUser = new UpdateUser(
      userRepository,
      refreshTokenRepository,
      memoRepository
    );

    const error = <BaseError>await updateUser.exec({
      user: User.create({
        userId: faker.string.uuid(),
        email,
        password,
        role: UserRole.CUSTOMER,
      }),
      user_id: userId,
    });

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal("User not found");
    expect(error.statusCode).equal(404);
  });
});
