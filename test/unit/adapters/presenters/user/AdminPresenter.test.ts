import { faker } from "@faker-js/faker";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import AdminPresenter from "../../../../../src/adapters/presenters/user/AdminPresenter";
import { expect } from "chai";

const adminPresenter = new AdminPresenter();

describe("/application/presenters/user/AdminPresenter.ts", () => {
  it("should return an external representation of an admin user object", () => {
    const userData = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.ADMIN,
    };
    const user = User.create(userData);
    const admin = adminPresenter.toJson(user);

    expect(admin.id).equal(userData.userId);
    expect(admin.email).equal(userData.email);
    expect(admin.role).equal(UserRole[userData.role]);
  });
});
