import sinon from 'sinon';
import { expect } from 'chai';
import memoRoutes from '../../../src/routes/memoRoutes';
import BaseController from '../../../src/adapters/controllers/BaseController';
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver';
import PinoDriver from '../../../src/infra/drivers/logger/PinoDriver';

class CustomController extends BaseController {
  statusCode = 200;
}

const logger = sinon.createStubInstance(PinoDriver);
const useCase = {
  exec: (data: undefined): Promise<void> => Promise.resolve(data),
};
const dependencies = {
  createMemoController: new CustomController({ logger, useCase }),
  findMemoByIdController: new CustomController({ logger, useCase }),
  updateMemoController: new CustomController({ logger, useCase }),
  deleteMemoController: new CustomController({ logger, useCase }),
};
const server = sinon.createStubInstance(ExpressDriver);

server.get = sinon.stub();
server.post = sinon.stub();
server.put = sinon.stub();
server.delete = sinon.stub();

describe('/infra/http/v1/memoRoutes.ts', () => {
  it('should return an array of memo routes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routes = memoRoutes(<any>dependencies, server);

    expect(routes).equal(undefined);
  });
});
