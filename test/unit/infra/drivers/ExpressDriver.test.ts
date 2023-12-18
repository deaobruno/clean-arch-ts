import axios from "axios";
import { expect } from "chai";
import ExpressDriver from "../../../../src/infra/drivers/server/ExpressDriver";
import BaseController from "../../../../src/adapters/controllers/BaseController";
import sinon from "sinon";
import PinoDriver from "../../../../src/infra/drivers/logger/PinoDriver";

const loggerDriver = sinon.createStubInstance(PinoDriver);
const server = new ExpressDriver(loggerDriver);
const { get, post, put, delete: del } = server;

const useCase = {
  exec: (): Promise<void> => Promise.resolve(),
};

const errorUseCase = {
  exec: (): Promise<void> => {
    throw new Error("test");
  },
};

class GetController extends BaseController {
  statusCode = 200;
}

class PostController extends BaseController {
  statusCode = 201;
}

class PutController extends BaseController {
  statusCode = 200;
}

class DeleteController extends BaseController {
  statusCode = 204;
}

class ErrorController extends BaseController {
  statusCode = 200;
}

const getController = new GetController({ useCase });
const postController = new PostController({ useCase });
const putController = new PutController({ useCase });
const deleteController = new DeleteController({ useCase });
const errorController = new ErrorController({ useCase: errorUseCase });
const routes = [get("/test/error", errorController)];

describe("/infra/drivers/server/ExpressDriver.ts", () => {
  it("should register a get route", () => {
    const route = get("/test/get", getController);

    routes.push(route);

    expect(route);
  });

  it("should register a post route", () => {
    const route = post("/test/post", postController);

    routes.push(route);

    expect(route);
  });

  it("should register a put route", () => {
    const route = put("/test/put", putController);

    routes.push(route);

    expect(route);
  });

  it("should register a delete route", () => {
    const route = del("/test/delete", deleteController);

    routes.push(route);

    expect(route);
  });

  it("should config the server passing an array of routes", () => {
    const result = server.config(routes);

    expect(result).equal(undefined);
  });

  it("should start the server passing an array of Routes", () => {
    const result = server.start(8080);

    expect(result).equal(undefined);
  });

  it("should get status 404 when trying to send request to an invalid URL", async () => {
    await axios
      .get("http://localhost:8080/test")
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("Invalid URL");
      });
  });

  it("should get status 500 when trying to send request to an URL with internal error", async () => {
    await axios
      .get("http://localhost:8080/test/error")
      .catch(({ response: { status, data } }) => {
        expect(status).equal(500);
        expect(data.error).equal("test");
      });
  });

  it("should stop the server", () => {
    const result = server.stop();

    expect(result).equal(undefined);
  });
});
