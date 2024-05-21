import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import config from '../../../../src/config';
import PinoDriver from '../../../../src/infra/drivers/logger/PinoDriver';
import MongoDbDriver from '../../../../src/infra/drivers/db/MongoDbDriver';
import RedisDriver from '../../../../src/infra/drivers/cache/RedisDriver';
import RefreshTokenRepository from '../../../../src/adapters/repositories/RefreshTokenRepository';
import RefreshTokenMapper from '../../../../src/domain/refreshToken/RefreshTokenMapper';
import RefreshToken from '../../../../src/domain/refreshToken/RefreshToken';
import User from '../../../../src/domain/user/User';
import UserRole from '../../../../src/domain/user/UserRole';
import IDbRefreshToken from '../../../../src/domain/refreshToken/IDbRefreshToken';

const sandbox = sinon.createSandbox();

describe('/adapters/repositories/RefreshTokenRepository', () => {
  afterEach(() => sandbox.restore());

  it('should save a RefreshToken entity in DB', async () => {
    const userId = faker.string.uuid();
    const token = 'refresh-token';
    const fakeRefreshToken = { userId, token };
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    sandbox.stub(RefreshToken, 'create').returns({
      userId,
      token,
    });
    refreshTokenMapper.entityToDb.returns({
      user_id: userId,
      token,
    });
    dbDriver.create.resolves();

    const result = await refreshTokenRepository.create(fakeRefreshToken);

    expect(result).equal(undefined);
  });

  it('should return all RefreshTokens from DB when no filter is passed', async () => {
    const dbRefreshTokens = [
      {
        user_id: faker.string.uuid(),
        token: 'refresh-token-1',
      },
      {
        user_id: faker.string.uuid(),
        token: 'refresh-token-2',
      },
      {
        user_id: faker.string.uuid(),
        token: 'refresh-token-3',
      },
    ];
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    dbDriver.find.resolves(dbRefreshTokens);
    refreshTokenMapper.dbToEntity
      .withArgs(dbRefreshTokens[0])
      .returns({
        userId: dbRefreshTokens[0].user_id,
        token: dbRefreshTokens[0].token,
      })
      .withArgs(dbRefreshTokens[1])
      .returns({
        userId: dbRefreshTokens[1].user_id,
        token: dbRefreshTokens[1].token,
      })
      .withArgs(dbRefreshTokens[2])
      .returns({
        userId: dbRefreshTokens[2].user_id,
        token: dbRefreshTokens[2].token,
      });

    const refreshTokens = await refreshTokenRepository.find();

    expect(refreshTokens[0].userId).equal(dbRefreshTokens[0].user_id);
    expect(refreshTokens[0].token).equal(dbRefreshTokens[0].token);
    expect(refreshTokens[1].userId).equal(dbRefreshTokens[1].user_id);
    expect(refreshTokens[1].token).equal(dbRefreshTokens[1].token);
    expect(refreshTokens[2].userId).equal(dbRefreshTokens[2].user_id);
    expect(refreshTokens[2].token).equal(dbRefreshTokens[2].token);
  });

  it('should return filtered RefreshTokens from DB when some filter is passed', async () => {
    const userId = faker.string.uuid();
    const dbRefreshTokens = [
      {
        user_id: userId,
        token: 'refresh-token-1',
      },
      {
        user_id: userId,
        token: 'refresh-token-2',
      },
    ];
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    dbDriver.find.resolves(dbRefreshTokens);
    refreshTokenMapper.dbToEntity
      .withArgs(dbRefreshTokens[0])
      .returns({
        userId: dbRefreshTokens[0].user_id,
        token: dbRefreshTokens[0].token,
      })
      .withArgs(dbRefreshTokens[1])
      .returns({
        userId: dbRefreshTokens[1].user_id,
        token: dbRefreshTokens[1].token,
      });

    const refreshTokens = await refreshTokenRepository.find({
      user_id: userId,
    });

    expect(refreshTokens[0].userId).equal(dbRefreshTokens[0].user_id);
    expect(refreshTokens[0].token).equal(dbRefreshTokens[0].token);
    expect(refreshTokens[1].userId).equal(dbRefreshTokens[1].user_id);
    expect(refreshTokens[1].token).equal(dbRefreshTokens[1].token);
  });

  it('should return an empty array when no RefreshTokens are found', async () => {
    const dbRefreshTokens: IDbRefreshToken[] = [];
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    dbDriver.find.resolves(dbRefreshTokens);

    const refreshTokens = await refreshTokenRepository.find();

    expect(refreshTokens.length).equal(0);
  });

  it('should return a RefreshToken from DB when some filter is passed', async () => {
    const userId = faker.string.uuid();
    const token = 'refresh-token';
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    dbDriver.findOne.resolves({
      user_id: userId,
      token,
    });
    refreshTokenMapper.dbToEntity.returns({
      userId,
      token,
    });

    const refreshToken = await refreshTokenRepository.findOne({
      user_id: userId,
    });

    expect(refreshToken?.userId).equal(userId);
    expect(refreshToken?.token).equal(token);
  });

  it('should return undefined when no RefreshToken is found', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    dbDriver.findOne.resolves();

    const refreshToken = await refreshTokenRepository.findOne({
      user_id: 'test',
    });

    expect(refreshToken).equal(undefined);
  });

  it('should return a RefreshToken from DB passing "userId" as a filter', async () => {
    const userId = faker.string.uuid();
    const token = 'refresh-token';
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    dbDriver.findOne.resolves({
      user_id: userId,
      token,
    });
    refreshTokenMapper.dbToEntity.returns({
      userId,
      token,
    });

    const refreshToken = <RefreshToken>(
      await refreshTokenRepository.findOneByUserId(userId)
    );

    expect(refreshToken.userId).equal(userId);
    expect(refreshToken.token).equal(token);
  });

  it('should return a RefreshToken from cache passing "userId" as a filter', async () => {
    const userId = faker.string.uuid();
    const token = 'refresh-token';
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    cacheDriver.get.resolves({
      userId,
      token,
    });

    const refreshToken = <RefreshToken>(
      await refreshTokenRepository.findOneByUserId(userId)
    );

    expect(refreshToken.userId).equal(userId);
    expect(refreshToken.token).equal(token);
  });

  it('should return undefined when no RefreshToken is found passing "userId" as a filter', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    dbDriver.findOne.resolves();

    const refreshToken = await refreshTokenRepository.findOneByUserId('test');

    expect(refreshToken).equal(undefined);
  });

  it('should delete a RefreshToken from DB', async () => {
    const refreshToken = <RefreshToken>RefreshToken.create({
      userId: faker.string.uuid(),
      token: 'refresh-token',
    });
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    dbDriver.delete.resolves();

    const result = await refreshTokenRepository.deleteOne(refreshToken);

    expect(result).equal(undefined);
  });

  it('should delete a RefreshToken from DB', async () => {
    const user = <User>User.create({
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    });
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const refreshTokenMapper = sandbox.createStubInstance(RefreshTokenMapper);
    const refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime,
    );

    dbDriver.deleteMany.resolves();

    const result = await refreshTokenRepository.deleteAllByUser(user);

    expect(result).equal(undefined);
  });
});
