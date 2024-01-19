import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import UpdateUserPassword from "../../../../../src/application/useCases/user/UpdateUserPassword";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import BaseError from "../../../../../src/application/errors/BaseError";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";
import RefreshTokenRepository from "../../../../../src/adapters/repositories/RefreshTokenRepository";
import CryptoDriver from "../../../../../src/infra/drivers/hash/CryptoDriver";

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

describe("/application/useCases/user/UpdateUserPassword.ts", () => {
  afterEach(() => sandbox.restore());

  it("should update the password of an existing user", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const updateUserPassword = new UpdateUserPassword(
      cryptoDriver,
      userRepository,
      refreshTokenRepository
    );

    cryptoDriver.hashString.returns("hash");
    userRepository.findOneById.resolves(fakeUser);

    const newPassword = faker.internet.password();

    fakeUser.password = cryptoDriver.hashString(newPassword);

    userRepository.update.resolves();
    refreshTokenRepository.deleteAllByUserId.resolves();

    const updateData = {
      user_id: userId,
      password: newPassword,
      confirm_password: newPassword,
    };

    const user = <User>(
      await updateUserPassword.exec({ user: fakeUser, ...updateData })
    );

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(fakeUser.email);
    expect(user.password).equal(fakeUser.password);
    expect(user.role).equal(fakeUser.role);
    expect(user.isCustomer).equal(true);
    expect(user.isRoot).equal(false);
  });

  it("should return a NotFoundError when authenticated user is different from request user", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const updateUserPassword = new UpdateUserPassword(
      cryptoDriver,
      userRepository,
      refreshTokenRepository
    );

    const error = <BaseError>await updateUserPassword.exec({
      user: fakeUser,
      user_id: "test",
      password: faker.internet.password(),
    });

    expect(error).deep.equal(new NotFoundError("User not found"));
  });

  it("should return a NotFoundError when trying to update an user password passing wrong ID", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const updateUserPassword = new UpdateUserPassword(
      cryptoDriver,
      userRepository,
      refreshTokenRepository
    );

    userRepository.findOneById.resolves();

    const error = <BaseError>await updateUserPassword.exec({
      user: fakeUser,
      user_id: userId,
      password: "",
    });

    expect(error).deep.equal(new NotFoundError("User not found"));
  });
});
