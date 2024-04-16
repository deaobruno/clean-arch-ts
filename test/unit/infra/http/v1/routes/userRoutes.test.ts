import sinon from "sinon";
import { expect } from "chai";
import userRoutes from "../../../../../../src/infra/http/v1/routes/userRoutes";
import BaseController from "../../../../../../src/adapters/controllers/BaseController";
import ExpressDriver from "../../../../../../src/infra/drivers/server/ExpressDriver";

class CustomController extends BaseController {
  statusCode = 200;
}

const useCase = {
  exec: (data: any): Promise<void> => Promise.resolve(data),
};
const dependencies = {
  findUsersController: new CustomController({ useCase }),
  findUserByIdController: new CustomController({ useCase }),
  findMemosByUserIdController: new CustomController({ useCase }),
  updateUserController: new CustomController({ useCase }),
  updateUserPasswordController: new CustomController({ useCase }),
  deleteUserController: new CustomController({ useCase }),
};
const server = sinon.createStubInstance(ExpressDriver);

server.get = sinon.stub();
server.put = sinon.stub();
server.delete = sinon.stub();

describe("/infra/http/v1/userRoutes.ts", () => {
  it("should return an array of user routes", () => {
    const routes = userRoutes(<any>dependencies, server);

    expect(routes).equal(undefined);
  });
});
