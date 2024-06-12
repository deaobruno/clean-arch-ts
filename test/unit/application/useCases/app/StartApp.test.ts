import cluster from 'node:cluster';
import sinon from 'sinon';
import { expect } from 'chai';
import ExpressDriver from '../../../../../src/infra/drivers/server/ExpressDriver';
import MongoDbDriver from '../../../../../src/infra/drivers/db/MongoDbDriver';
import RedisDriver from '../../../../../src/infra/drivers/cache/RedisDriver';
import CreateRootUserEvent from '../../../../../src/adapters/events/user/CreateRootUserEvent';
import StartApp from '../../../../../src/application/useCases/app/StartApp';
import dependencies from '../../../../../src/dependencies';

const sandbox = sinon.createSandbox();
const usersSource = 'users';
const memosSource = 'memos';
const rootUserEmail = 'root@email.com';
const rootUserPassword = 'password';
const port = 8080;

describe('/src/application/useCases/app/StartApp.ts', () => {
  afterEach(() => sandbox.restore());

  it('should start the application in "production" environment', async () => {
    const server = sandbox.createStubInstance(ExpressDriver);
    const db = sandbox.createStubInstance(MongoDbDriver);
    const cache = sandbox.createStubInstance(RedisDriver);
    const createRootUserEvent = sandbox.createStubInstance(CreateRootUserEvent);
    const startAppUseCase = new StartApp(
      server,
      db,
      cache,
      createRootUserEvent,
      usersSource,
      memosSource,
      rootUserEmail,
      rootUserPassword,
      port,
      'production',
    );
    const clusterStub = sandbox.stub(cluster);
    const result = await startAppUseCase.exec({
      cluster: clusterStub,
      numCPUs: 4,
      dependencies,
      routes: () => {},
    });

    expect(result).equal(undefined);
  });

  it('should start the application in environment different than "production"', async () => {
    const server = sandbox.createStubInstance(ExpressDriver);
    const db = sandbox.createStubInstance(MongoDbDriver);
    const cache = sandbox.createStubInstance(RedisDriver);
    const createRootUserEvent = sandbox.createStubInstance(CreateRootUserEvent);
    const startAppUseCase = new StartApp(
      server,
      db,
      cache,
      createRootUserEvent,
      usersSource,
      memosSource,
      rootUserEmail,
      rootUserPassword,
      port,
      'development',
    );
    const clusterStub = sandbox.stub(cluster);
    const result = await startAppUseCase.exec({
      cluster: clusterStub,
      numCPUs: 4,
      dependencies,
      routes: () => {},
    });

    expect(result).equal(undefined);
  });
});
