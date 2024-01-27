import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import config from "../../../../src/config";
import UserRepository from "../../../../src/adapters/repositories/UserRepository";
import UserMapper from "../../../../src/domain/user/UserMapper";
import UserRole from "../../../../src/domain/user/UserRole";
import User from "../../../../src/domain/user/User";
import MongoDbDriver from "../../../../src/infra/drivers/db/MongoDbDriver";
import NodeCacheDriver from "../../../../src/infra/drivers/cache/NodeCacheDriver";

const sandbox = sinon.createSandbox();

describe("/adapters/repositories/UserRepository", () => {
  afterEach(() => sandbox.restore());

  it("should save an User entity", async () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const role = UserRole.CUSTOMER;
    const fakeUser = {
      userId,
      email,
      password,
      role,
      isRoot: false,
      isCustomer: true,
      memos: [],
      addMemo: () => {},
    };
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    sandbox.stub(User, "create").returns(fakeUser);
    userMapper.entityToDb.returns({
      user_id: userId,
      email,
      password,
      role,
    });
    dbDriver.create.resolves();

    const result = await userRepository.create(fakeUser);

    expect(result).equal(undefined);
  });

  it("should return all users from DB when no filter is passed", async () => {
    const dbUsers = [
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.ROOT,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      },
    ];
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.find.resolves(dbUsers);
    userMapper.dbToEntity
      .withArgs(dbUsers[0])
      .returns({
        userId: dbUsers[0].user_id,
        email: dbUsers[0].email,
        password: dbUsers[0].password,
        role: dbUsers[0].role,
        isRoot: true,
        isCustomer: false,
        memos: [],
        addMemo: () => {},
      })
      .withArgs(dbUsers[1])
      .returns({
        userId: dbUsers[1].user_id,
        email: dbUsers[1].email,
        password: dbUsers[1].password,
        role: dbUsers[1].role,
        isRoot: false,
        isCustomer: false,
        memos: [],
        addMemo: () => {},
      })
      .withArgs(dbUsers[2])
      .returns({
        userId: dbUsers[2].user_id,
        email: dbUsers[2].email,
        password: dbUsers[2].password,
        role: dbUsers[2].role,
        isRoot: false,
        isCustomer: true,
        memos: [],
        addMemo: () => {},
      });

    const users = await userRepository.find();

    expect(users[0].userId).equal(dbUsers[0].user_id);
    expect(users[0].email).equal(dbUsers[0].email);
    expect(users[0].password).equal(dbUsers[0].password);
    expect(users[0].role).equal(dbUsers[0].role);
    expect(users[0].isRoot).equal(true);
    expect(users[0].isCustomer).equal(false);
    expect(users[1].userId).equal(dbUsers[1].user_id);
    expect(users[1].email).equal(dbUsers[1].email);
    expect(users[1].password).equal(dbUsers[1].password);
    expect(users[1].role).equal(dbUsers[1].role);
    expect(users[1].isRoot).equal(false);
    expect(users[1].isCustomer).equal(false);
    expect(users[2].userId).equal(dbUsers[2].user_id);
    expect(users[2].email).equal(dbUsers[2].email);
    expect(users[2].password).equal(dbUsers[2].password);
    expect(users[2].role).equal(dbUsers[2].role);
    expect(users[2].isRoot).equal(false);
    expect(users[2].isCustomer).equal(true);
  });

  it("should return filtered Users from DB when some filter is passed", async () => {
    const dbUsers = [
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      },
    ];
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.find.resolves(dbUsers);
    userMapper.dbToEntity
      .withArgs(dbUsers[0])
      .returns({
        userId: dbUsers[0].user_id,
        email: dbUsers[0].email,
        password: dbUsers[0].password,
        role: dbUsers[0].role,
        isRoot: false,
        isCustomer: true,
        memos: [],
        addMemo: () => {},
      })
      .withArgs(dbUsers[1])
      .returns({
        userId: dbUsers[1].user_id,
        email: dbUsers[1].email,
        password: dbUsers[1].password,
        role: dbUsers[1].role,
        isRoot: false,
        isCustomer: true,
        memos: [],
        addMemo: () => {},
      });

    const users = await userRepository.find({ role: UserRole.CUSTOMER });

    expect(users[0].userId).equal(dbUsers[0].user_id);
    expect(users[0].email).equal(dbUsers[0].email);
    expect(users[0].password).equal(dbUsers[0].password);
    expect(users[0].role).equal(dbUsers[0].role);
    expect(users[0].isRoot).equal(false);
    expect(users[0].isCustomer).equal(true);
    expect(users[1].userId).equal(dbUsers[1].user_id);
    expect(users[1].email).equal(dbUsers[1].email);
    expect(users[1].password).equal(dbUsers[1].password);
    expect(users[1].role).equal(dbUsers[1].role);
    expect(users[1].isRoot).equal(false);
    expect(users[1].isCustomer).equal(true);
  });

  it("should return an empty array when no Users are found", async () => {
    const dbUsers: any[] = [];
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.find.resolves(dbUsers);

    const users = await userRepository.find();

    expect(users.length).equal(0);
  });

  it("should return an User from DB when some filter is passed", async () => {
    const dbUser = {
      user_id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    };
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.findOne.resolves(dbUser);
    userMapper.dbToEntity.returns({
      userId: dbUser.user_id,
      email: dbUser.email,
      password: dbUser.password,
      role: dbUser.role,
      isRoot: false,
      isCustomer: true,
      memos: [],
      addMemo: () => {},
    });

    const user = await userRepository.findOne({ user_id: dbUser.user_id });

    expect(user?.userId).equal(dbUser.user_id);
    expect(user?.email).equal(dbUser.email);
    expect(user?.password).equal(dbUser.password);
    expect(user?.role).equal(dbUser.role);
    expect(user?.isRoot).equal(false);
    expect(user?.isCustomer).equal(true);
  });

  it("should return undefined when no User is found", async () => {
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.findOne.resolves();

    const user = await userRepository.findOne({ user_id: "test" });

    expect(user).equal(undefined);
  });

  it("should return an User from db passing user_id as a filter", async () => {
    const dbUser = {
      user_id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    };
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.findOne.resolves(dbUser);
    userMapper.dbToEntity.returns(
      User.create({ ...dbUser, userId: dbUser.user_id })
    );

    const user = <User>await userRepository.findOneById(dbUser.user_id);

    expect(user.userId).equal(dbUser.user_id);
    expect(user.email).equal(dbUser.email);
    expect(user.password).equal(dbUser.password);
    expect(user.role).equal(dbUser.role);
    expect(user.isRoot).equal(false);
    expect(user.isCustomer).equal(true);
  });

  it("should return an User from cache passing user_id as a filter", async () => {
    const userEntity = User.create({
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    });
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    cacheDriver.get.returns(userEntity);

    const user = <User>await userRepository.findOneById(userEntity.userId);

    expect(user.userId).equal(userEntity.userId);
    expect(user.email).equal(userEntity.email);
    expect(user.password).equal(userEntity.password);
    expect(user.role).equal(userEntity.role);
    expect(user.isRoot).equal(false);
    expect(user.isCustomer).equal(true);
  });

  it("should return undefined when passing an invalid user_id as a filter", async () => {
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.findOne.resolves();

    const user = await userRepository.findOneById("");

    expect(user).equal(undefined);
  });

  it("should return an User from db passing an email as a filter", async () => {
    const dbUser = {
      user_id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    };
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.findOne.resolves(dbUser);
    userMapper.dbToEntity.returns(
      User.create({ ...dbUser, userId: dbUser.user_id })
    );

    const user = <User>await userRepository.findOneByEmail(dbUser.email);

    expect(user.userId).equal(dbUser.user_id);
    expect(user.email).equal(dbUser.email);
    expect(user.password).equal(dbUser.password);
    expect(user.role).equal(dbUser.role);
    expect(user.isRoot).equal(false);
    expect(user.isCustomer).equal(true);
  });

  it("should return an User from cache passing an email as a filter", async () => {
    const userEntity = User.create({
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    });
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    cacheDriver.get.returns(userEntity);

    const user = <User>await userRepository.findOneByEmail(userEntity.email);

    expect(user.userId).equal(userEntity.userId);
    expect(user.email).equal(userEntity.email);
    expect(user.password).equal(userEntity.password);
    expect(user.role).equal(userEntity.role);
    expect(user.isRoot).equal(false);
    expect(user.isCustomer).equal(true);
  });

  it("should return undefined when passing an invalid email as a filter", async () => {
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.findOne.resolves();

    const user = await userRepository.findOneByEmail("");

    expect(user).equal(undefined);
  });

  it("should return an array of customer Users", async () => {
    const dbUsers = [
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      },
    ];
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.find.resolves(dbUsers);
    userMapper.dbToEntity
      .withArgs(dbUsers[0])
      .returns(User.create({ ...dbUsers[0], userId: dbUsers[0].user_id }))
      .withArgs(dbUsers[1])
      .returns(User.create({ ...dbUsers[1], userId: dbUsers[1].user_id }))
      .withArgs(dbUsers[2])
      .returns(User.create({ ...dbUsers[2], userId: dbUsers[2].user_id }));

    const customers = await userRepository.findCustomers();

    expect(customers.length).equal(3);
    expect(customers[0].userId).equal(dbUsers[0].user_id);
    expect(customers[0].email).equal(dbUsers[0].email);
    expect(customers[0].password).equal(dbUsers[0].password);
    expect(customers[0].role).equal(UserRole.CUSTOMER);
    expect(customers[0].isCustomer).equal(true);
    expect(customers[0].isRoot).equal(false);
    expect(customers[1].userId).equal(dbUsers[1].user_id);
    expect(customers[1].email).equal(dbUsers[1].email);
    expect(customers[1].password).equal(dbUsers[1].password);
    expect(customers[1].role).equal(UserRole.CUSTOMER);
    expect(customers[1].isCustomer).equal(true);
    expect(customers[1].isRoot).equal(false);
    expect(customers[2].userId).equal(dbUsers[2].user_id);
    expect(customers[2].email).equal(dbUsers[2].email);
    expect(customers[2].password).equal(dbUsers[2].password);
    expect(customers[2].role).equal(UserRole.CUSTOMER);
    expect(customers[2].isCustomer).equal(true);
    expect(customers[2].isRoot).equal(false);
  });

  it("should return an empty array of customer Users", async () => {
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.find.resolves([]);

    const customers = await userRepository.findCustomers();

    expect(customers).length(0);
  });

  it("should update an User from DB", async () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const role = UserRole.CUSTOMER;
    const fakeUser = {
      userId,
      email,
      password,
      role,
      isRoot: false,
      isCustomer: true,
      memos: [],
      addMemo: () => {},
    };
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.update.resolves();

    const result = await userRepository.update(fakeUser);

    expect(result).equal(undefined);
  });

  it("should delete an User from DB", async () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const role = UserRole.CUSTOMER;
    const fakeUser = {
      userId,
      email,
      password,
      role,
      isRoot: false,
      isCustomer: true,
      memos: [],
      addMemo: () => {},
    };
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    const userMapper = sandbox.createStubInstance(UserMapper);
    const userRepository = new UserRepository(
      config.db.usersSource,
      dbDriver,
      cacheDriver,
      userMapper
    );

    dbDriver.delete.resolves();

    const result = await userRepository.deleteOne(fakeUser);

    expect(result).equal(undefined);
  });
});
