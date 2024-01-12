import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import DeleteUser from "../../../../../src/application/useCases/user/DeleteUser";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import BaseError from "../../../../../src/application/errors/BaseError";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";
import RefreshTokenRepository from "../../../../../src/adapters/repositories/RefreshTokenRepository";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import MemoRepository from "../../../../../src/adapters/repositories/MemoRepository";

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = User.create({
  userId: faker.string.uuid(),
  email,
  password,
  role: UserRole.CUSTOMER,
});

describe("/application/useCases/user/DeleteUser.ts", () => {
  afterEach(() => sandbox.restore());

  it("should delete an existing user", async () => {
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const deleteUser: DeleteUser = new DeleteUser(
      userRepository,
      refreshTokenRepository,
      memoRepository
    );

    userRepository.findOne.resolves(fakeUser);
    userRepository.delete.resolves();
    refreshTokenRepository.delete.resolves();
    memoRepository.delete.resolves();

    const result = await deleteUser.exec({ user_id: userId });

    expect(result).equal(undefined);
  });

  it("should fail when trying to update an user password passing wrong ID", async () => {
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const deleteUser: DeleteUser = new DeleteUser(
      userRepository,
      refreshTokenRepository,
      memoRepository
    );

    const error = <BaseError>await deleteUser.exec({ user_id: "" });

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal("User not found");
    expect(error.statusCode).equal(404);
  });
});
