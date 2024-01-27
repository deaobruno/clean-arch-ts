import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UserRole from "../../../../src/domain/user/UserRole";
import User from "../../../../src/domain/user/User";
import Memo from "../../../../src/domain/memo/Memo";

const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();

describe("/domain/user/User.ts", () => {
  it("should create a root User entity object", () => {
    const userData = {
      userId,
      email,
      password,
      role: UserRole.ROOT,
    };
    const user = User.create(userData);

    expect(user.userId).equal(userData.userId);
    expect(user.email).equal(userData.email);
    expect(user.password).equal(userData.password);
    expect(user.role).equal(UserRole.ROOT);
    expect(user.isRoot).equal(true);
  });

  it("should create a customer User entity object", () => {
    const userData = {
      userId,
      email,
      password,
      role: UserRole.CUSTOMER,
    };
    const user = User.create(userData);

    expect(user.userId).equal(userData.userId);
    expect(user.email).equal(userData.email);
    expect(user.password).equal(userData.password);
    expect(user.role).equal(UserRole.CUSTOMER);
    expect(user.isCustomer).equal(true);
  });

  it("should fail when trying to create an User entity with empty userId", () => {
    const userData = {
      userId: "",
      email,
      password,
      role: UserRole.CUSTOMER,
    };

    expect(() => User.create(userData)).throw('User: "userId" required');
  });

  it("should fail when trying to create an User entity with invalid userId", () => {
    const userData = {
      userId: "test",
      email,
      password,
      role: UserRole.CUSTOMER,
    };

    expect(() => User.create(userData)).throw('User: Invalid "userId"');
  });

  it("should fail when trying to create an User entity with empty email", () => {
    const userData = {
      userId,
      email: "",
      password,
      role: UserRole.ROOT,
    };

    expect(() => User.create(userData)).throw('User: "email" required');
  });

  it("should fail when trying to create an User entity with invalid email", () => {
    const userData = {
      userId,
      email: "email",
      password,
      role: UserRole.ROOT,
    };

    expect(() => User.create(userData)).throw('User: Invalid "email"');
  });

  it("should fail when trying to create an User entity with empty password", () => {
    const userData = {
      userId,
      email,
      password: "",
      role: UserRole.ROOT,
    };

    expect(() => User.create(userData)).throw('User: "password" required');
  });

  it("should fail when trying to create an User entity with invalid role", () => {
    const userData = {
      userId,
      email,
      password,
      role: -1,
    };

    expect(() => User.create(userData)).throw('User: Invalid "role"');
  });

  it("should add a memo to an user", () => {
    const userData = {
      userId,
      email,
      password,
      role: UserRole.CUSTOMER,
    };
    const user = User.create(userData);
    const memoData = {
      memoId: faker.string.uuid(),
      userId,
      title: "New Memo",
      text: "Lorem ipsum",
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };
    const memo = Memo.create(memoData);

    user.addMemo(memo);

    expect(user.memos.length).equal(1);
    expect(user.memos[0]).deep.equal(memo);
  });

  it("should get an error when trying to add the same memo to an user", () => {
    const userData = {
      userId,
      email,
      password,
      role: UserRole.CUSTOMER,
    };
    const user = User.create(userData);
    const memoData = {
      memoId: faker.string.uuid(),
      userId,
      title: "New Memo",
      text: "Lorem ipsum",
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };
    const memo = Memo.create(memoData);

    user.addMemo(memo);

    expect(() => user.addMemo(memo)).to.throw(
      "User: memo already added to user"
    );
  });
});
