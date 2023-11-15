import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import config from "../../../../../src/config";
import UserRepository from "../../../../../src/adapters/repositories/inMemory/InMemoryUserRepository";
import InMemoryDriver from "../../../../../src/infra/drivers/db/InMemoryDriver";
import IDbDriver from "../../../../../src/infra/drivers/db/IDbDriver";
import IUserRepository from "../../../../../src/domain/user/IUserRepository";
import UserMapper from "../../../../../src/domain/user/UserMapper";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";

const sandbox = sinon.createSandbox();
let inMemoryDriver: IDbDriver;
let userMapper: UserMapper;
let userRepository: IUserRepository;

describe("/adapters/repositories/inMemory/InMemoryUserRepository", () => {
  beforeEach(() => {
    inMemoryDriver = InMemoryDriver.getInstance();
    userMapper = new UserMapper();
    userRepository = new UserRepository(
      config.db.usersSource,
      inMemoryDriver,
      userMapper
    );
  });

  afterEach(() => sandbox.restore());

  it("should save an User entity", async () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const level = UserRole.CUSTOMER;
    const fakeUser = {
      userId,
      email,
      password,
      level,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    };

    sandbox.stub(User, "create").returns(fakeUser);
    sandbox.stub(userMapper, "entityToDb").returns({
      user_id: userId,
      email,
      password,
      level,
    });
    sandbox.stub(inMemoryDriver, "create").resolves({
      user_id: userId,
      email,
      password,
      level,
    });

    const result = await userRepository.create(fakeUser);

    expect(result).equal(undefined);
  });

  it("should return all users from DB when no filter is passed", async () => {
    const dbUsers = [
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.ROOT,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.ADMIN,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.CUSTOMER,
      },
    ];

    sandbox.stub(inMemoryDriver, "find").resolves(dbUsers);
    sandbox
      .stub(userMapper, "dbToEntity")
      .withArgs(dbUsers[0])
      .returns({
        userId: dbUsers[0].user_id,
        email: dbUsers[0].email,
        password: dbUsers[0].password,
        level: dbUsers[0].level,
        isRoot: true,
        isAdmin: false,
        isCustomer: false,
      })
      .withArgs(dbUsers[1])
      .returns({
        userId: dbUsers[1].user_id,
        email: dbUsers[1].email,
        password: dbUsers[1].password,
        level: dbUsers[1].level,
        isRoot: false,
        isAdmin: true,
        isCustomer: false,
      })
      .withArgs(dbUsers[2])
      .returns({
        userId: dbUsers[2].user_id,
        email: dbUsers[2].email,
        password: dbUsers[2].password,
        level: dbUsers[2].level,
        isRoot: false,
        isAdmin: false,
        isCustomer: true,
      });

    const users = await userRepository.find();

    expect(users[0].userId).equal(dbUsers[0].user_id);
    expect(users[0].email).equal(dbUsers[0].email);
    expect(users[0].password).equal(dbUsers[0].password);
    expect(users[0].level).equal(dbUsers[0].level);
    expect(users[0].isRoot).equal(true);
    expect(users[0].isAdmin).equal(false);
    expect(users[0].isCustomer).equal(false);
    expect(users[1].userId).equal(dbUsers[1].user_id);
    expect(users[1].email).equal(dbUsers[1].email);
    expect(users[1].password).equal(dbUsers[1].password);
    expect(users[1].level).equal(dbUsers[1].level);
    expect(users[1].isRoot).equal(false);
    expect(users[1].isAdmin).equal(true);
    expect(users[1].isCustomer).equal(false);
    expect(users[2].userId).equal(dbUsers[2].user_id);
    expect(users[2].email).equal(dbUsers[2].email);
    expect(users[2].password).equal(dbUsers[2].password);
    expect(users[2].level).equal(dbUsers[2].level);
    expect(users[2].isRoot).equal(false);
    expect(users[2].isAdmin).equal(false);
    expect(users[2].isCustomer).equal(true);
  });

  it("should return filtered Users from DB when some filter is passed", async () => {
    const dbUsers = [
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.CUSTOMER,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.CUSTOMER,
      },
    ];

    sandbox.stub(inMemoryDriver, "find").resolves(dbUsers);
    sandbox
      .stub(userMapper, "dbToEntity")
      .withArgs(dbUsers[0])
      .returns({
        userId: dbUsers[0].user_id,
        email: dbUsers[0].email,
        password: dbUsers[0].password,
        level: dbUsers[0].level,
        isRoot: false,
        isAdmin: false,
        isCustomer: true,
      })
      .withArgs(dbUsers[1])
      .returns({
        userId: dbUsers[1].user_id,
        email: dbUsers[1].email,
        password: dbUsers[1].password,
        level: dbUsers[1].level,
        isRoot: false,
        isAdmin: false,
        isCustomer: true,
      });

    const users = await userRepository.find();

    expect(users[0].userId).equal(dbUsers[0].user_id);
    expect(users[0].email).equal(dbUsers[0].email);
    expect(users[0].password).equal(dbUsers[0].password);
    expect(users[0].level).equal(dbUsers[0].level);
    expect(users[0].isRoot).equal(false);
    expect(users[0].isAdmin).equal(false);
    expect(users[0].isCustomer).equal(true);
    expect(users[1].userId).equal(dbUsers[1].user_id);
    expect(users[1].email).equal(dbUsers[1].email);
    expect(users[1].password).equal(dbUsers[1].password);
    expect(users[1].level).equal(dbUsers[1].level);
    expect(users[1].isRoot).equal(false);
    expect(users[1].isAdmin).equal(false);
    expect(users[1].isCustomer).equal(true);
  });

  it("should return an empty array when no Users are found", async () => {
    const dbUsers: any[] = [];

    sandbox.stub(inMemoryDriver, "find").resolves(dbUsers);

    const users = await userRepository.find();

    expect(users.length).equal(0);
  });

  it("should return an User from DB when some filter is passed", async () => {
    const dbUser = {
      user_id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: UserRole.CUSTOMER,
    };

    sandbox.stub(inMemoryDriver, "findOne").resolves(dbUser);
    sandbox.stub(userMapper, "dbToEntity").returns({
      userId: dbUser.user_id,
      email: dbUser.email,
      password: dbUser.password,
      level: dbUser.level,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    });

    const user = await userRepository.findOne({ user_id: dbUser.user_id });

    expect(user?.userId).equal(dbUser.user_id);
    expect(user?.email).equal(dbUser.email);
    expect(user?.password).equal(dbUser.password);
    expect(user?.level).equal(dbUser.level);
    expect(user?.isRoot).equal(false);
    expect(user?.isAdmin).equal(false);
    expect(user?.isCustomer).equal(true);
  });

  it("should return undefined when no User is found", async () => {
    sandbox.stub(inMemoryDriver, "findOne").resolves();

    const user = await userRepository.findOne({ user_id: "test" });

    expect(user).equal(undefined);
  });

  it("should return an User passing an email as a filter", async () => {
    const dbUser = {
      user_id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: UserRole.CUSTOMER,
    };

    sandbox.stub(inMemoryDriver, "findOne").resolves(dbUser);

    const user = <User>await userRepository.findOneByEmail(dbUser.email);

    expect(user.userId).equal(dbUser.user_id);
    expect(user.email).equal(dbUser.email);
    expect(user.password).equal(dbUser.password);
    expect(user.level).equal(dbUser.level);
    expect(user.isRoot).equal(false);
    expect(user.isAdmin).equal(false);
    expect(user.isCustomer).equal(true);
  });

  it("should return undefined when passing an invalid email as a filter", async () => {
    sandbox.stub(inMemoryDriver, "findOne").resolves();

    const user = await userRepository.findOneByEmail("");

    expect(user).equal(undefined);
  });

  it("should return an array of admin Users", async () => {
    const dbUsers = [
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.ADMIN,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.ADMIN,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.ADMIN,
      },
    ];

    sandbox
      .stub(userMapper, "dbToEntity")
      .withArgs(dbUsers[0])
      .returns({
        userId: dbUsers[0].user_id,
        email: dbUsers[0].email,
        password: dbUsers[0].password,
        level: dbUsers[0].level,
        isRoot: false,
        isAdmin: true,
        isCustomer: false,
      })
      .withArgs(dbUsers[1])
      .returns({
        userId: dbUsers[1].user_id,
        email: dbUsers[1].email,
        password: dbUsers[1].password,
        level: dbUsers[1].level,
        isRoot: false,
        isAdmin: true,
        isCustomer: false,
      })
      .withArgs(dbUsers[2])
      .returns({
        userId: dbUsers[2].user_id,
        email: dbUsers[2].email,
        password: dbUsers[2].password,
        level: dbUsers[2].level,
        isRoot: false,
        isAdmin: true,
        isCustomer: false,
      });
    sandbox.stub(inMemoryDriver, "find").resolves(dbUsers);

    const admins = await userRepository.findAdmins();

    expect(admins.length).equal(3);
    expect(admins[0].userId).equal(dbUsers[0].user_id);
    expect(admins[0].email).equal(dbUsers[0].email);
    expect(admins[0].password).equal(dbUsers[0].password);
    expect(admins[0].level).equal(1);
    expect(admins[0].isCustomer).equal(false);
    expect(admins[0].isAdmin).equal(true);
    expect(admins[0].isRoot).equal(false);
    expect(admins[1].userId).equal(dbUsers[1].user_id);
    expect(admins[1].email).equal(dbUsers[1].email);
    expect(admins[1].password).equal(dbUsers[1].password);
    expect(admins[1].level).equal(1);
    expect(admins[1].isCustomer).equal(false);
    expect(admins[1].isAdmin).equal(true);
    expect(admins[1].isRoot).equal(false);
    expect(admins[2].userId).equal(dbUsers[2].user_id);
    expect(admins[2].email).equal(dbUsers[2].email);
    expect(admins[2].password).equal(dbUsers[2].password);
    expect(admins[2].level).equal(1);
    expect(admins[2].isCustomer).equal(false);
    expect(admins[2].isAdmin).equal(true);
    expect(admins[2].isRoot).equal(false);
  });

  it("should return an empty array of admin Users", async () => {
    sandbox.stub(inMemoryDriver, "find").resolves([]);

    const admins = await userRepository.findAdmins();

    expect(admins).length(0);
  });

  it("should return an array of customer Users", async () => {
    const dbUsers = [
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.CUSTOMER,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.CUSTOMER,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: UserRole.CUSTOMER,
      },
    ];

    sandbox.stub(inMemoryDriver, "find").resolves(dbUsers);

    const customers = await userRepository.findCustomers();

    expect(customers.length).equal(3);
    expect(customers[0].userId).equal(dbUsers[0].user_id);
    expect(customers[0].email).equal(dbUsers[0].email);
    expect(customers[0].password).equal(dbUsers[0].password);
    expect(customers[0].level).equal(2);
    expect(customers[0].isCustomer).equal(true);
    expect(customers[0].isAdmin).equal(false);
    expect(customers[0].isRoot).equal(false);
    expect(customers[1].userId).equal(dbUsers[1].user_id);
    expect(customers[1].email).equal(dbUsers[1].email);
    expect(customers[1].password).equal(dbUsers[1].password);
    expect(customers[1].level).equal(2);
    expect(customers[1].isCustomer).equal(true);
    expect(customers[1].isAdmin).equal(false);
    expect(customers[1].isRoot).equal(false);
    expect(customers[2].userId).equal(dbUsers[2].user_id);
    expect(customers[2].email).equal(dbUsers[2].email);
    expect(customers[2].password).equal(dbUsers[2].password);
    expect(customers[2].level).equal(2);
    expect(customers[2].isCustomer).equal(true);
    expect(customers[2].isAdmin).equal(false);
    expect(customers[2].isRoot).equal(false);
  });

  it("should return an empty array of customer Users", async () => {
    sandbox.stub(inMemoryDriver, "find").resolves([]);

    const customers = await userRepository.findCustomers();

    expect(customers).length(0);
  });

  it("should update an User from DB", async () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const level = UserRole.CUSTOMER;
    const fakeUser = {
      userId,
      email,
      password,
      level,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    };

    sandbox.stub(inMemoryDriver, "update").resolves();

    const result = await userRepository.update(fakeUser, { user_id: "test" });

    expect(result).equal(undefined);
  });

  it("should delete an User from DB", async () => {
    sandbox.stub(inMemoryDriver, "delete").resolves();

    const result = await userRepository.delete({ user_id: "test" });

    expect(result).equal(undefined);
  });
});
