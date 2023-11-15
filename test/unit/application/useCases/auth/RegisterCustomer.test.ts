import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import RegisterCustomer from "../../../../../src/application/useCases/auth/RegisterCustomer";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import CryptoDriver from "../../../../../src/infra/drivers/hash/CryptoDriver";
import ConflictError from "../../../../../src/application/errors/ConflictError";
import IUserRepository from "../../../../../src/domain/user/IUserRepository";
import BaseError from "../../../../../src/application/errors/BaseError";
import UserRepositoryMock from "../../../../mocks/repositories/inMemory/InMemoryUserRepositoryMock";
import HashDriverMock from "../../../../mocks/drivers/HashDriverMock";

const sandbox = sinon.createSandbox();
const cryptoDriver: CryptoDriver = HashDriverMock;
const userRepository: IUserRepository = UserRepositoryMock;
const registerCustomer = new RegisterCustomer(userRepository, cryptoDriver);
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser: User = {
  userId: faker.string.uuid(),
  email,
  password,
  level: UserRole.CUSTOMER,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
};
const userParams = {
  email,
  password,
  confirm_password: password,
  level: UserRole.CUSTOMER,
};
let conflictError: ConflictError;

describe("/application/useCases/auth/RegisterCustomer.ts", () => {
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

    const user = <User>await registerCustomer.exec(userParams);

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(userParams.email);
    expect(user.password).equal(userParams.password);
    expect(user.level).equal(UserRole.CUSTOMER);
    expect(user.isCustomer).equal(true);
    expect(user.isAdmin).equal(false);
    expect(user.isRoot).equal(false);
  });

  it("should fail when trying to create an Admin User with repeated email", async () => {
    sandbox.stub(userRepository, "findOneByEmail").resolves(fakeUser);
    sandbox.stub(userRepository, "create").resolves();
    sandbox.stub(User, "create").returns(fakeUser);

    const error = <BaseError>await registerCustomer.exec(userParams);

    expect(error instanceof ConflictError).equal(true);
    expect(error.message).equal("Email already in use");
    expect(error.statusCode).equal(409);
  });
});
