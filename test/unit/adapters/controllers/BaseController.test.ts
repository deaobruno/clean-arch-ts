import sinon from 'sinon';
import { expect } from 'chai';
import BaseController from '../../../../src/adapters/controllers/BaseController';
import IUseCase from '../../../../src/application/useCases/IUseCase';
import ISchema from '../../../../src/infra/schemas/ISchema';
import BadRequestError from '../../../../src/application/errors/BadRequestError';
import ControllerConfig from '../../../../src/adapters/controllers/ControllerConfig';
import BaseError from '../../../../src/application/errors/BaseError';
import PinoDriver from '../../../../src/infra/drivers/logger/PinoDriver';

class CustomController extends BaseController {
  statusCode = 200;

  constructor(config: ControllerConfig<IUseCase<unknown, unknown>, ISchema>) {
    super(config);
  }
}

const sandbox = sinon.createSandbox();
const logger = sandbox.createStubInstance(PinoDriver);

describe('/adapters/controllers/BaseController.ts', () => {
  afterEach(() => sandbox.restore());

  it('should return successfully without data', async () => {
    const useCase = {
      exec: async () => {},
    };
    const customController = new CustomController({ logger, useCase });
    const result = await customController.handle({}, {});

    expect(result).equal(undefined);
  });

  it('should return successfully with data', async () => {
    const body = { test: 'ok' };
    const useCase = {
      exec: async (data: unknown) => {
        return data;
      },
    };
    const customController = new CustomController({ logger, useCase });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await customController.handle({}, <any>body);

    expect(result).deep.equal(body);
  });

  it('should return successfully when more than 1 input is passed', async () => {
    const body = { test: 'ok' };
    const params = { id: 1 };
    const useCase = {
      exec: async (data: unknown) => {
        return data;
      },
    };
    const customController = new CustomController({ logger, useCase });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await customController.handle({}, <any>{
      ...body,
      ...params,
    });

    expect(result).deep.equal({ ...body, ...params });
  });

  it('should return successfully when schema validation returns void', async () => {
    const body = { test: 'ok' };
    const useCase = {
      exec: async (data: unknown) => {
        return data;
      },
    };
    const schema = {
      validate: () => undefined,
    };
    const customController = new CustomController({ logger, useCase, schema });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await customController.handle({}, <any>body);

    expect(result).deep.equal(body);
  });

  it('should return a BadRequestError when schema validation returns an error', async () => {
    const body = { test: 'ok' };
    const useCase = {
      exec: async (data: unknown) => {
        return data;
      },
    };
    const schema = {
      validate: () => new Error('Error'),
    };
    const customController = new CustomController({ logger, useCase, schema });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = <BaseError>await customController.handle({}, <any>body);

    expect(error instanceof BadRequestError).equal(true);
    expect(error.message).equal('Error');
    expect(error.statusCode).equal(400);
  });

  it('should return a single object formatted by presenter', async () => {
    const useCase = {
      exec: async (data: unknown) => {
        return data;
      },
    };
    const presenter = {
      toJson: (data: unknown) => data,
    };
    const controller = new CustomController({ logger, useCase, presenter });
    const data = { test: 'test', invalid: false };

    expect(
      await controller.handle(
        { 'content-type': 'application/json' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <any>data,
      ),
    ).deep.equal(data);
  });

  it('should return an array of objects formatted by presenter', async () => {
    const useCase = {
      exec: async (data: unknown) => {
        return data;
      },
    };
    const presenter = {
      toJson: (data: unknown) => data,
    };
    const controller = new CustomController({ logger, useCase, presenter });
    const data = [
      { test: 'test', invalid: false },
      { test: 'test', invalid: false },
      { test: 'test', invalid: false },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await controller.handle({}, <any>data);

    expect(result).deep.equal(data);
  });
});
