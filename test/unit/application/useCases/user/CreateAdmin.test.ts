import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import CreateAdmin from "../../../../../src/application/useCases/user/CreateAdmin";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import ConflictError from "../../../../../src/application/errors/ConflictError";
import BaseError from "../../../../../src/application/errors/BaseError";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";
import CryptoDriver from "../../../../../src/infra/drivers/hash/CryptoDriver";

const sandbox = sinon.createSandbox();
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = {
  userId: faker.string.uuid(),
  email,
  password,
  role: UserRole.ADMIN,
  isRoot: false,
  isAdmin: true,
  isCustomer: false,
};
let userParams = {
  email,
  password,
  confirm_password: password,
  role: UserRole.ADMIN,
};

describe("/application/useCases/user/CreateAdmin.ts", () => {
  afterEach(() => sandbox.restore());

  it("should successfully create an Admin User", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const createAdmin = new CreateAdmin(userRepository, cryptoDriver);

    userRepository.findOneByEmail.resolves();
    cryptoDriver.generateID.returns(faker.string.uuid());
    cryptoDriver.hashString.returns("hash");
    userRepository.create.resolves();
    sandbox.stub(User, "create").returns(fakeUser);

    const user = <User>await createAdmin.exec(userParams);

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(userParams.email);
    expect(user.password).equal(userParams.password);
    expect(user.role).equal(UserRole.ADMIN);
    expect(user.isCustomer).equal(false);
    expect(user.isAdmin).equal(true);
    expect(user.isRoot).equal(false);
  });

  it("should fail when trying to create an Admin User with repeated email", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const createAdmin = new CreateAdmin(userRepository, cryptoDriver);

    userRepository.findOneByEmail.resolves(fakeUser);

    const error = <BaseError>await createAdmin.exec(userParams);

    expect(error instanceof ConflictError).equal(true);
    expect(error.message).equal("Email already in use");
    expect(error.statusCode).equal(409);
  });
});
