import sinon from "sinon";
import { faker } from "@faker-js/faker";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import FindUsers from "../../../../../src/application/useCases/user/FindUsers";
import { expect } from "chai";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import BaseError from "../../../../../src/application/errors/BaseError";
import UserRepository from "../../../../../src/adapters/repositories/UserRepository";

const sandbox = sinon.createSandbox();
const fakeUsers = [
  User.create({
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: UserRole.CUSTOMER,
  }),
  User.create({
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: UserRole.CUSTOMER,
  }),
  User.create({
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: UserRole.CUSTOMER,
  }),
];

describe("/application/useCases/user/FindUsers.ts", () => {
  afterEach(() => sandbox.restore());

  it("should return an array with all users when no filter is passed", async () => {
    const userRepository = sandbox.createStubInstance(UserRepository);
    const findUsers = new FindUsers(userRepository);

    userRepository.find.resolves(fakeUsers);

    const users = <User[]>await findUsers.exec({ user: fakeUsers[0] });

    expect(users.length).equal(3);
    expect(users[0].userId).equal(fakeUsers[0].userId);
    expect(users[0].email).equal(fakeUsers[0].email);
    expect(users[0].password).equal(fakeUsers[0].password);
    expect(users[0].role).equal(fakeUsers[0].role);
    expect(users[0].isCustomer).equal(true);
    expect(users[0].isRoot).equal(false);
    expect(users[1].userId).equal(fakeUsers[1].userId);
    expect(users[1].email).equal(fakeUsers[1].email);
    expect(users[1].password).equal(fakeUsers[1].password);
    expect(users[1].role).equal(fakeUsers[1].role);
    expect(users[1].isCustomer).equal(true);
    expect(users[1].isRoot).equal(false);
    expect(users[2].userId).equal(fakeUsers[2].userId);
    expect(users[2].email).equal(fakeUsers[2].email);
    expect(users[2].password).equal(fakeUsers[2].password);
    expect(users[2].role).equal(fakeUsers[2].role);
    expect(users[2].isCustomer).equal(true);
    expect(users[2].isRoot).equal(false);
  });

  it("should return an array with filtered users", async () => {
    const userRepository = sandbox.createStubInstance(UserRepository);
    const findUsers = new FindUsers(userRepository);

    userRepository.find.resolves([fakeUsers[0]]);

    const users = <User[]>(
      await findUsers.exec({ user: fakeUsers[0], email: fakeUsers[0].email })
    );

    expect(users.length).equal(1);
    expect(users[0].userId).equal(fakeUsers[0].userId);
    expect(users[0].email).equal(fakeUsers[0].email);
    expect(users[0].password).equal(fakeUsers[0].password);
    expect(users[0].role).equal(fakeUsers[0].role);
    expect(users[0].isCustomer).equal(true);
    expect(users[0].isRoot).equal(false);
  });

  it("should return a NotFoundError when no users are found", async () => {
    const userRepository = sandbox.createStubInstance(UserRepository);
    const findUsers = new FindUsers(userRepository);

    userRepository.find.resolves([]);

    const error = <BaseError>await findUsers.exec({ user: fakeUsers[0] });

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal("Users not found");
    expect(error.statusCode).equal(404);
  });

  it("should return a NotFoundError when no users are found", async () => {
    const userRepository = sandbox.createStubInstance(UserRepository);
    const findUsers = new FindUsers(userRepository);

    userRepository.find.resolves([]);

    const error = <BaseError>await findUsers.exec({ user: fakeUsers[0] });

    expect(error instanceof NotFoundError).equal(true);
    expect(error.message).equal("Users not found");
    expect(error.statusCode).equal(404);
  });
});
