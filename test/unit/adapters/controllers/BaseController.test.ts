import sinon from "sinon";
import { expect } from "chai";
import BaseController from "../../../../src/adapters/controllers/BaseController";
import IUseCase from "../../../../src/application/useCases/IUseCase";
import ISchema from "../../../../src/infra/schemas/ISchema";
import BadRequestError from "../../../../src/application/errors/BadRequestError";
import ControllerConfig from "../../../../src/adapters/controllers/ControllerConfig";

class CustomController extends BaseController {
  statusCode = 200;

  constructor(config: ControllerConfig<IUseCase<any, any>, ISchema>) {
    super(config);
  }
}

const sandbox = sinon.createSandbox();

describe("/adapters/controllers/BaseController.ts", () => {
  afterEach(() => sandbox.restore());

  it("should return successfully without data", async () => {
    const useCase = {
      exec: async (data: any) => {
        return;
      },
    };
    const customController = new CustomController({ useCase });
    const result = await customController.handle({}, {});

    expect(result).equal(undefined);
  });

  it("should return successfully with data", async () => {
    const body = { test: "ok" };
    const useCase = {
      exec: async (data: any) => {
        return data;
      },
    };
    const customController = new CustomController({ useCase });
    const result = await customController.handle({}, body);

    expect(result).deep.equal(body);
  });

  it("should return successfully when more than 1 input is passed", async () => {
    const body = { test: "ok" };
    const params = { id: 1 };
    const useCase = {
      exec: async (data: any) => {
        return data;
      },
    };
    const customController = new CustomController({ useCase });
    const result = await customController.handle({}, { ...body, ...params });

    expect(result).deep.equal({ ...body, ...params });
  });

  it("should return successfully when schema validation returns void", async () => {
    const body = { test: "ok" };
    const useCase = {
      exec: async (data: any) => {
        return data;
      },
    };
    const schema = {
      validate: () => undefined,
    };
    const customController = new CustomController({ useCase, schema });
    const result = await customController.handle({}, body);

    expect(result).deep.equal(body);
  });

  it("should return a BadRequestError when schema validation returns an error", async () => {
    const body = { test: "ok" };
    const useCase = {
      exec: async (data: any) => {
        return data;
      },
    };
    const schema = {
      validate: () => new Error("Error"),
    };
    const customController = new CustomController({ useCase, schema });
    const error = await customController.handle({}, body);

    expect(error instanceof BadRequestError).equal(true);
    expect(error.message).equal("Error");
    expect(error.statusCode).equal(400);
  });

  it("should return a single object formatted by presenter", async () => {
    const useCase = {
      exec: async (data: any) => {
        return data;
      },
    };
    const presenter = {
      toJson: (data: any) => data,
    };
    const controller = new CustomController({ useCase, presenter });
    const data = { test: "test", invalid: false };

    expect(
      await controller.handle({ "content-type": "application/json" }, data)
    ).deep.equal(data);
  });

  it("should return an array of objects formatted by presenter", async () => {
    const useCase = {
      exec: async (data: any) => {
        return data;
      },
    };
    const presenter = {
      toJson: (data: any) => data,
    };
    const controller = new CustomController({ useCase, presenter });
    const data = [
      { test: "test", invalid: false },
      { test: "test", invalid: false },
      { test: "test", invalid: false },
    ];
    const result = await controller.handle({}, data);

    expect(result).deep.equal(data);
  });
});
