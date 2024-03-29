import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import RegisterCustomer from "../../../../../src/application/useCases/auth/RegisterCustomer";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import CryptoDriver from "../../../../../src/infra/drivers/hash/CryptoDriver";
import ConflictError from "../../../../../src/application/errors/ConflictError";
import BaseError from "../../../../../src/application/errors/BaseError";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";

const sandbox = sinon.createSandbox();
const email = faker.internet.email();
const password = faker.internet.password();
const fakeUser = <User>User.create({
  userId: faker.string.uuid(),
  email,
  password,
  role: UserRole.CUSTOMER,
});
const userParams = {
  email,
  password,
  confirm_password: password,
  role: UserRole.CUSTOMER,
};

describe("/application/useCases/auth/RegisterCustomer.ts", () => {
  afterEach(() => sandbox.restore());

  it("should successfully create a Customer User", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const registerCustomer = new RegisterCustomer(userRepository, cryptoDriver);

    userRepository.findOneByEmail.resolves();
    cryptoDriver.generateID.returns(faker.string.uuid());
    cryptoDriver.hashString.returns("hash");
    userRepository.create.resolves();
    sandbox.stub(User, "create").returns(fakeUser);

    const user = <User>await registerCustomer.exec(userParams);

    expect(user.userId).equal(fakeUser.userId);
    expect(user.email).equal(userParams.email);
    expect(user.password).equal(userParams.password);
    expect(user.role).equal(UserRole.CUSTOMER);
    expect(user.isCustomer).equal(true);
    expect(user.isRoot).equal(false);
  });

  it("should fail when trying to create a Customer User with repeated email", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const userRepository = sandbox.createStubInstance(UserRepository);
    const registerCustomer = new RegisterCustomer(userRepository, cryptoDriver);

    userRepository.findOneByEmail.resolves(fakeUser);

    const error = <BaseError>await registerCustomer.exec(userParams);

    expect(error).deep.equal(new ConflictError("Email already in use"));
  });
});
