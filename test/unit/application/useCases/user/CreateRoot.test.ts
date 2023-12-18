import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import CreateRoot from "../../../../../src/application/useCases/user/CreateRoot";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";
import CryptoDriver from "../../../../../src/infra/drivers/hash/CryptoDriver";

const sandbox = sinon.createSandbox();
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

describe("/application/useCases/user/CreateRoot.ts", () => {
  afterEach(() => sandbox.restore());

  it("should successfully create a Root User", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const createRoot = new CreateRoot(userRepository, cryptoDriver);

    userRepository.findOneByEmail.resolves();
    cryptoDriver.generateID.returns(faker.string.uuid());
    cryptoDriver.hashString.returns("hash");
    userRepository.create.resolves();
    sandbox.stub(User, "create").returns(fakeUser);

    const result = await createRoot.exec(userParams);

    expect(result).equal(undefined);
  });

  it("should return void when Root User already exists", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const createRoot = new CreateRoot(userRepository, cryptoDriver);

    userRepository.findOneByEmail.resolves(fakeUser);

    const result = await createRoot.exec(userParams);

    expect(result).equal(undefined);
  });
});
