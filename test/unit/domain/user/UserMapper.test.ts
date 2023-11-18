import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UserRole from "../../../../src/domain/user/UserRole";
import User from "../../../../src/domain/user/User";
import UserMapper from "../../../../src/domain/user/UserMapper";

const userMapper = new UserMapper();

describe("/src/domain/user/UserMapper.ts", () => {
  it("should map an user entity to user db data", () => {
    const userData = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    };
    const user = User.create(userData);
    const userDbData = userMapper.entityToDb(user);

    expect(userDbData.user_id).equal(user.userId);
    expect(userDbData.email).equal(user.email);
    expect(userDbData.password).equal(user.password);
    expect(userDbData.role).equal(user.role);
  });

  it("should map user db data to an user entity", () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const role = UserRole.CUSTOMER;

    sinon.stub(User, "create").returns({
      userId,
      email,
      password,
      role,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    });

    const userDbData = {
      user_id: userId,
      email,
      password,
      role,
    };
    const user = userMapper.dbToEntity(userDbData);

    expect(user.userId).equal(userDbData.user_id);
    expect(user.email).equal(userDbData.email);
    expect(user.password).equal(userDbData.password);
    expect(user.role).equal(userDbData.role);

    sinon.restore();
  });
});
