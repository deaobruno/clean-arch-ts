import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import CreateRoot from "../../../../../src/application/useCases/user/CreateRoot";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import ConflictError from "../../../../../src/application/errors/ConflictError";
import IUserRepository from "../../../../../src/domain/user/IUserRepository";
import IHashDriver from "../../../../../src/infra/drivers/hash/IHashDriver";
import HashDriverMock from "../../../../mocks/drivers/HashDriverMock";
import UserRepositoryMock from "../../../../mocks/repositories/inMemory/InMemoryUserRepositoryMock";

const sandbox = sinon.createSandbox();
const cryptoDriver: IHashDriver = HashDriverMock;
const userRepository: IUserRepository = UserRepositoryMock;
const createRoot = new CreateRoot(userRepository, cryptoDriver);
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = {
  userId: faker.string.uuid(),
  email,
  password,
  role: UserRole.ROOT,
  isRoot: true,
  isAdmin: false,
  isCustomer: false,
};
let userParams = {
  email,
  password,
  confirm_password: password,
  role: UserRole.ROOT,
};
let conflictError: ConflictError;

describe("/application/useCases/user/CreateRoot.ts", () => {
  beforeEach(() => {
    conflictError = sandbox.stub(ConflictError.prototype);
    conflictError.name = "ConflictError";
    conflictError.statusCode = 409;
    conflictError.message = "Email already in use";
  });

  afterEach(() => sandbox.restore());

  it("should successfully create a Root User", async () => {
    sandbox.stub(userRepository, "create").resolves();
    sandbox.stub(User, "create").returns(fakeUser);

    const result = await createRoot.exec(userParams);

    expect(result).equal(undefined);
  });

  it("should return void when Root User already exists", async () => {
    sandbox.stub(userRepository, "findOneByEmail").resolves(fakeUser);
    sandbox.stub(userRepository, "create").resolves();
    sandbox.stub(User, "create").returns(fakeUser);

    const result = await createRoot.exec(userParams);

    expect(result).equal(undefined);
  });
});
