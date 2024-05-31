import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import RefreshAccessToken from '../../../../../src/application/useCases/auth/RefreshAccessToken';
import BaseError from '../../../../../src/application/errors/BaseError';
import RefreshTokenRepository from '../../../../../src/adapters/repositories/RefreshTokenRepository';
import UserRole from '../../../../../src/domain/user/UserRole';
import ForbiddenError from '../../../../../src/application/errors/ForbiddenError';
import JwtDriver from '../../../../../src/infra/drivers/token/JwtDriver';
import RefreshToken from '../../../../../src/domain/refreshToken/RefreshToken';
import User from '../../../../../src/domain/user/User';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';
import InternalServerError from '../../../../../src/application/errors/InternalServerError';

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const userData = {
  userId,
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: UserRole.CUSTOMER,
};
const user = <User>User.create(userData);

describe('/application/useCases/auth/RefreshAccessToken.ts', () => {
  afterEach(() => sandbox.restore());

  it('should return a JWT access token', async () => {
    const refreshToken = <RefreshToken>RefreshToken.create({
      userId,
      token: 'refresh-token',
    });
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const refreshAccessToken = new RefreshAccessToken(
      loggerDriver,
      tokenDriver,
      refreshTokenRepository,
    );

    tokenDriver.validateRefreshToken.returns({ id: userId });
    refreshTokenRepository.deleteOne.resolves();
    tokenDriver.generateAccessToken.returns('access-token');
    tokenDriver.generateRefreshToken.returns('new-refresh-token');
    sandbox
      .stub(RefreshToken, 'create')
      .returns({ userId: faker.string.uuid(), token: 'new-refresh-token' });
    refreshTokenRepository.create.resolves();

    const { accessToken } = <any>(
      await refreshAccessToken.exec({ user, refreshToken })
    );

    expect(accessToken).equal('access-token');
  });

  it('should fail when refresh token is expired', async () => {
    const refreshToken = <RefreshToken>RefreshToken.create({
      userId,
      token: 'refresh-token',
    });
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const refreshAccessToken = new RefreshAccessToken(
      loggerDriver,
      tokenDriver,
      refreshTokenRepository,
    );

    refreshTokenRepository.findOneByUserId.resolves({
      userId,
      token: 'refresh-token',
    });
    tokenDriver.validateRefreshToken.throws({ name: 'TokenExpiredError' });

    const error = <BaseError>(
      await refreshAccessToken.exec({ user, refreshToken })
    );

    expect(error instanceof ForbiddenError).equal(true);
    expect(error.message).equal(
      `[RefreshAccessToken] Refresh token expired: ${refreshToken.token}`,
    );
    expect(error.statusCode).equal(403);
  });

  it('should fail when refresh token is invalid', async () => {
    const refreshToken = <RefreshToken>RefreshToken.create({
      userId,
      token: 'refresh-token',
    });
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const refreshAccessToken = new RefreshAccessToken(
      loggerDriver,
      tokenDriver,
      refreshTokenRepository,
    );

    refreshTokenRepository.findOneByUserId.resolves({
      userId,
      token: 'refresh-token',
    });
    tokenDriver.validateRefreshToken.throws({});

    const error = <BaseError>(
      await refreshAccessToken.exec({ user, refreshToken })
    );

    expect(error instanceof ForbiddenError).equal(true);
    expect(error.message).equal(
      `[RefreshAccessToken] Invalid refresh token: ${refreshToken.token}`,
    );
    expect(error.statusCode).equal(403);
  });

  it('should return an InternalServerError when RefreshToken entity returns error', async () => {
    const refreshToken = <RefreshToken>RefreshToken.create({
      userId,
      token: '',
    });
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const tokenDriver = sandbox.createStubInstance(JwtDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const refreshAccessToken = new RefreshAccessToken(
      loggerDriver,
      tokenDriver,
      refreshTokenRepository,
    );

    tokenDriver.validateRefreshToken.returns({ id: userId });

    const error = <BaseError>(
      await refreshAccessToken.exec({ user, refreshToken })
    );

    expect(error instanceof InternalServerError).equal(true);
    expect(error.message).equal('[RefreshToken] "token" required');
    expect(error.statusCode).equal(500);
  });
});
