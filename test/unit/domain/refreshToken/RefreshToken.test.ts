import { faker } from "@faker-js/faker";
import { expect } from "chai";
import RefreshToken from "../../../../src/domain/refreshToken/RefreshToken";

describe("/domain/refreshToken/RefreshToken.ts", () => {
  it("should create a root User entity object", () => {
    const refreshToken = <RefreshToken>RefreshToken.create({
      userId: faker.string.uuid(),
      token: faker.string.alphanumeric(),
    });

    expect(typeof refreshToken.token).equal("string");
  });

  it("should fail when trying to create an User entity with empty userId", () => {
    expect(RefreshToken.create({ userId: "", token: "" })).deep.equal(Error('[RefreshToken] "userId" required'));
  });

  it("should fail when trying to create an User entity with invalid userId", () => {
    expect(RefreshToken.create({ userId: "test", token: "" })).deep.equal(Error('[RefreshToken] Invalid "userId"'));
  });

  it("should fail when trying to create an User entity with empty token", () => {
    expect(RefreshToken.create({ userId: faker.string.uuid(), token: "" })).deep.equal(Error('[RefreshToken] "token" required'));
  });
});
