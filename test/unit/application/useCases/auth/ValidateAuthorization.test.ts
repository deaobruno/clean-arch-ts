import { faker } from "@faker-js/faker";
import { expect } from "chai";
import ValidateAuthorization from "../../../../../src/application/useCases/auth/ValidateAuthorization";
import ForbiddenError from "../../../../../src/application/errors/ForbiddenError";
import BaseError from "../../../../../src/application/errors/BaseError";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";

const validateAuthorization = new ValidateAuthorization();

describe("/application/useCases/auth/ValidateAuthorization.ts", () => {
  it("should return void when user is root", () => {
    const user = User.create({
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.ROOT,
    });

    expect(validateAuthorization.exec({ user })).equal(undefined);
  });

  it("should return a ForbiddenError when user is customer", () => {
    const user = User.create({
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    });
    const error = <BaseError>validateAuthorization.exec({ user });

    expect(error instanceof ForbiddenError).equal(true);
    expect(error.message).equal("Forbidden");
    expect(error.statusCode).equal(403);
  });
});
