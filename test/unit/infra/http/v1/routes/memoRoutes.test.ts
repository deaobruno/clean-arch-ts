import sinon from "sinon";
import { expect } from "chai";
import memoRoutes from "../../../../../../src/infra/http/v1/routes/memoRoutes";
import BaseController from "../../../../../../src/adapters/controllers/BaseController";
import ExpressDriver from "../../../../../../src/infra/drivers/server/ExpressDriver";

class CustomController extends BaseController {
  statusCode = 200;
}

const useCase = {
  exec: (data: any): Promise<void> => Promise.resolve(data),
};
const dependencies = {
  createMemoController: new CustomController({ useCase }),
  findMemoByIdController: new CustomController({ useCase }),
  findMemosByUserIdController: new CustomController({ useCase }),
  updateMemoController: new CustomController({ useCase }),
  deleteMemoController: new CustomController({ useCase }),
};
const server = sinon.createStubInstance(ExpressDriver);

server.get = sinon.stub();
server.post = sinon.stub();
server.put = sinon.stub();
server.delete = sinon.stub();

describe("/infra/http/v1/memoRoutes.ts", () => {
  it("should return an array of memo routes", () => {
    const routes = memoRoutes(dependencies, server);

    expect(routes.length).equal(5);
  });
});
