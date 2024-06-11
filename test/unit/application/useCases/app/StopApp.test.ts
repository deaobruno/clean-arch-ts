import sinon from 'sinon';
import { expect } from 'chai';
import ExpressDriver from '../../../../../src/infra/drivers/server/ExpressDriver';
import MongoDbDriver from '../../../../../src/infra/drivers/db/MongoDbDriver';
import RedisDriver from '../../../../../src/infra/drivers/cache/RedisDriver';
import RefreshTokenRepository from '../../../../../src/adapters/repositories/RefreshTokenRepository';
import StopApp from '../../../../../src/application/useCases/app/StopApp';

const sandbox = sinon.createSandbox();
const rootUserEmail = 'root@email.com';

describe('/src/application/useCases/app/StopApp.ts', () => {
  afterEach(() => sandbox.restore());

  it('should stop the application in "production" environment', async () => {
    const server = sandbox.createStubInstance(ExpressDriver);
    const db = sandbox.createStubInstance(MongoDbDriver);
    const cache = sandbox.createStubInstance(RedisDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const stopAppUseCase = new StopApp(
      server,
      db,
      cache,
      refreshTokenRepository,
      rootUserEmail,
      'production',
    );

    const result = await stopAppUseCase.exec();

    expect(result).equal(undefined);
  });

  it('should stop the application in environment different than "production"', async () => {
    const server = sandbox.createStubInstance(ExpressDriver);
    const db = sandbox.createStubInstance(MongoDbDriver);
    const cache = sandbox.createStubInstance(RedisDriver);
    const refreshTokenRepository = sandbox.createStubInstance(
      RefreshTokenRepository,
    );
    const stopAppUseCase = new StopApp(
      server,
      db,
      cache,
      refreshTokenRepository,
      rootUserEmail,
      'development',
    );

    const result = await stopAppUseCase.exec();

    expect(result).equal(undefined);
  });
});
