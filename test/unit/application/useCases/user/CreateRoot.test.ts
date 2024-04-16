import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import CreateRoot from "../../../../../src/application/useCases/user/CreateRoot";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";
import CryptoDriver from "../../../../../src/infra/drivers/hash/CryptoDriver";
import BcryptDriver from "../../../../../src/infra/drivers/encryption/BcryptDriver";

const sandbox = sinon.createSandbox();
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = User.create({
  userId: faker.string.uuid(),
  email,
  password,
  role: UserRole.ROOT,
});
const userParams = {
  email,
  password,
  confirm_password: password,
  role: UserRole.ROOT,
};

describe("/application/useCases/user/CreateRoot.ts", () => {
  afterEach(() => sandbox.restore());

  it("should successfully create a Root User", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const encryptionDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const createRoot = new CreateRoot(cryptoDriver, encryptionDriver, userRepository);

    userRepository.findOneByEmail.resolves();
    cryptoDriver.generateID.returns(faker.string.uuid());
    encryptionDriver.encrypt.resolves("hash");
    userRepository.create.resolves();
    sandbox.stub(User, "create").returns(fakeUser);

    const result = await createRoot.exec(userParams);

    expect(result).equal(undefined);
  });

  it("should return void when Root User already exists", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const encryptionDriver = sandbox.createStubInstance(BcryptDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const createRoot = new CreateRoot(cryptoDriver, encryptionDriver, userRepository);

    userRepository.findOneByEmail.resolves(fakeUser);

    const result = await createRoot.exec(userParams);

    expect(result).equal(undefined);
  });
});
