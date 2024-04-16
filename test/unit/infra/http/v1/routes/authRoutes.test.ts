import sinon from "sinon";
import { expect } from "chai";
import authRotes from "../../../../../../src/infra/http/v1/routes/authRoutes";
import BaseController from "../../../../../../src/adapters/controllers/BaseController";
import ExpressDriver from "../../../../../../src/infra/drivers/server/ExpressDriver";

class CustomController extends BaseController {
  statusCode = 200;
}

const useCase = {
  exec: (data: any): Promise<void> => Promise.resolve(data),
};
const dependencies = {
  registerCustomerController: new CustomController({ useCase }),
  loginController: new CustomController({ useCase }),
  refreshAccessTokenController: new CustomController({ useCase }),
  logoutController: new CustomController({ useCase }),
};
const server = sinon.createStubInstance(ExpressDriver);

server.get = sinon.stub();
server.post = sinon.stub();
server.put = sinon.stub();
server.delete = sinon.stub();

describe("/infra/http/v1/authRoutes.ts", () => {
  it("should return an array of auth routes", () => {
    const routes = authRotes(<any>dependencies, server);

    expect(routes).equal(undefined);
  });
});
