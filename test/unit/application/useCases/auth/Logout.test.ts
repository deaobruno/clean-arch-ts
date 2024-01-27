import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import RefreshTokenRepository from "../../../../../src/adapters/repositories/RefreshTokenRepository";
import Logout from "../../../../../src/application/useCases/auth/Logout";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import RefreshToken from "../../../../../src/domain/refreshToken/RefreshToken";

const sandbox = sinon.createSandbox();
const user = User.create({
  userId: faker.string.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: UserRole.CUSTOMER,
});

describe("/application/useCases/auth/Logout.ts", () => {
  afterEach(() => sandbox.restore());

  it("should delete a refresh token", async () => {
    const refreshToken = RefreshToken.create({
      userId: user.userId,
      token: "token",
    });
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository
    );
    const logout = new Logout(refreshTokenRepository);

    refreshTokenRepository.deleteOne.resolves();

    expect(await logout.exec({ refreshToken })).equal(undefined);
  });
});
