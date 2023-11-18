import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UserRole from "../../../../src/domain/user/UserRole";
import User from "../../../../src/domain/user/User";

const userId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();

describe("/domain/user/User.ts", () => {
  it("should create a root User entity object", () => {
    const userParams = {
      userId,
      email,
      password,
      role: UserRole.ROOT,
    };
    const user = User.create(userParams);

    expect(user.userId).equal(userParams.userId);
    expect(user.email).equal(userParams.email);
    expect(user.password).equal(userParams.password);
    expect(user.role).equal(UserRole.ROOT);
    expect(user.isRoot).equal(true);
  });

  it("should create an admin User entity object", () => {
    const userParams = {
      userId,
      email,
      password,
      role: UserRole.ADMIN,
    };
    const user = User.create(userParams);

    expect(user.userId).equal(userParams.userId);
    expect(user.email).equal(userParams.email);
    expect(user.password).equal(userParams.password);
    expect(user.role).equal(UserRole.ADMIN);
    expect(user.isAdmin).equal(true);
  });

  it("should create a customer User entity object", () => {
    const userParams = {
      userId,
      email,
      password,
      role: UserRole.CUSTOMER,
    };
    const user = User.create(userParams);

    expect(user.userId).equal(userParams.userId);
    expect(user.email).equal(userParams.email);
    expect(user.password).equal(userParams.password);
    expect(user.role).equal(UserRole.CUSTOMER);
    expect(user.isCustomer).equal(true);
  });

  it("should fail when trying to create an User entity with empty userId", () => {
    const userParams = {
      userId: "",
      email,
      password,
      role: UserRole.ADMIN,
    };

    expect(() => User.create(userParams)).throw('User: "userId" required');
  });

  it("should fail when trying to create an User entity with invalid userId", () => {
    const userParams = {
      userId: "test",
      email,
      password,
      role: UserRole.ADMIN,
    };

    expect(() => User.create(userParams)).throw('User: Invalid "userId"');
  });

  it("should fail when trying to create an User entity with empty email", () => {
    const userParams = {
      userId,
      email: "",
      password,
      role: UserRole.ROOT,
    };

    expect(() => User.create(userParams)).throw('User: "email" required');
  });

  it("should fail when trying to create an User entity with invalid email", () => {
    const userParams = {
      userId,
      email: "email",
      password,
      role: UserRole.ROOT,
    };

    expect(() => User.create(userParams)).throw('User: Invalid "email"');
  });

  it("should fail when trying to create an User entity with empty password", () => {
    const userParams = {
      userId,
      email,
      password: "",
      role: UserRole.ROOT,
    };

    expect(() => User.create(userParams)).throw('User: "password" required');
  });

  it("should fail when trying to create an User entity with invalid role", () => {
    const userParams = {
      userId,
      email,
      password,
      role: -1,
    };

    expect(() => User.create(userParams)).throw('User: Invalid "role"');
  });
});
