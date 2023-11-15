import { faker } from "@faker-js/faker";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import CustomerPresenter from "../../../../../src/adapters/presenters/user/CustomerPresenter";
import { expect } from "chai";

const customerPresenter = new CustomerPresenter();

describe("/application/presenters/user/CustomerPresenter.ts", () => {
  it("should return an external representation of a customer user object", () => {
    const userData = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: UserRole.CUSTOMER,
    };
    const user = User.create(userData);
    const customer = customerPresenter.present(user);

    expect(customer.id).equal(userData.userId);
    expect(customer.email).equal(userData.email);
  });
});
