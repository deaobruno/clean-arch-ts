import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import CreateAdmin from "../../../../../src/application/useCases/user/CreateAdmin";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import ConflictError from "../../../../../src/application/errors/ConflictError";
import IUserRepository from "../../../../../src/domain/user/IUserRepository";
import BaseError from "../../../../../src/application/errors/BaseError";
import IHashDriver from "../../../../../src/infra/drivers/hash/IHashDriver";
import HashDriverMock from "../../../../mocks/drivers/HashDriverMock";
import UserRepositoryMock from "../../../../mocks/repositories/inMemory/InMemoryUserRepositoryMock";

const sandbox = sinon.createSandbox();
const cryptoDriver: IHashDriver = HashDriverMock;
const userRepository: IUserRepository = UserRepositoryMock;
const createAdmin = new CreateAdmin(userRepository, cryptoDriver);
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
let conflictError: ConflictError;

describe("/application/useCases/user/CreateAdmin.ts", () => {
  beforeEach(() => {
    conflictError = sandbox.stub(ConflictError.prototype);
    conflictError.name = "ConflictError";
    conflictError.statusCode = 409;
    conflictError.message = "Email already in use";
  });

  afterEach(() => sandbox.restore());

  it("should successfully create an Admin User", async () => {
    sandbox.stub(userRepository, "create").resolves();
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
    sandbox.stub(userRepository, "findOneByEmail").resolves(fakeUser);
    sandbox.stub(userRepository, "create").resolves();
    sandbox.stub(User, "create").returns(fakeUser);

    const error = <BaseError>await createAdmin.exec(userParams);

    expect(error instanceof ConflictError).equal(true);
    expect(error.message).equal("Email already in use");
    expect(error.statusCode).equal(409);
  });
});
