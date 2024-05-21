import sinon from 'sinon';
import { expect } from 'chai';
import userRoutes from '../../../../../../src/infra/http/v1/routes/userRoutes';
import BaseController from '../../../../../../src/adapters/controllers/BaseController';
import ExpressDriver from '../../../../../../src/infra/drivers/server/ExpressDriver';
import PinoDriver from '../../../../../../src/infra/drivers/logger/PinoDriver';

class CustomController extends BaseController {
  statusCode = 200;
}

const logger = sinon.createStubInstance(PinoDriver);
const useCase = {
  exec: (data: undefined): Promise<void> => Promise.resolve(data),
};
const dependencies = {
  findUsersController: new CustomController({ logger, useCase }),
  findUserByIdController: new CustomController({ logger, useCase }),
  findMemosByUserIdController: new CustomController({ logger, useCase }),
  updateUserController: new CustomController({ logger, useCase }),
  updateUserPasswordController: new CustomController({ logger, useCase }),
  deleteUserController: new CustomController({ logger, useCase }),
};
const server = sinon.createStubInstance(ExpressDriver);

server.get = sinon.stub();
server.put = sinon.stub();
server.delete = sinon.stub();

describe('/infra/http/v1/userRoutes.ts', () => {
  it('should return an array of user routes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routes = userRoutes(<any>dependencies, server);

    expect(routes).equal(undefined);
  });
});
