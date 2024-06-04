import { Server } from 'node:http';
import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { expect } from 'chai';
import config from '../../../../../src/config';
import ExpressDriver from '../../../../../src/infra/drivers/server/ExpressDriver';
import BaseController from '../../../../../src/adapters/controllers/BaseController';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';
import BadRequestError from '../../../../../src/application/errors/BadRequestError';
import CryptoDriver from '../../../../../src/infra/drivers/hash/CryptoDriver';
import IServer from '../../../../../src/infra/drivers/server/IServerDriver';

const sandbox = sinon.createSandbox();
const { cors } = config;
const useCase = {
  exec: (data: unknown): Promise<unknown> => Promise.resolve(data),
};
const badRequestErrorUseCase = {
  exec: (): Promise<void | Error> => {
    return Promise.resolve(new BadRequestError());
  },
};
const internalServerErrorUseCase = {
  exec: (): Promise<void> => {
    throw new Error();
  },
};
const errorUseCase = {
  exec: (): Promise<void> => {
    throw new Error('Error');
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

const port = 8080;

describe('/infra/drivers/server/ExpressDriver.ts', () => {
  afterEach(() => sandbox.restore());

  it('should register a get route', () => {
    const logger = sandbox.createStubInstance(PinoDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const server = new ExpressDriver(logger, hashDriver, cors);
    const { get } = server;
    const getController = new GetController({ logger, useCase });
    const result = get('/get', getController);

    expect(result).equal(undefined);
  });

  it('should register a post route', () => {
    const logger = sandbox.createStubInstance(PinoDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const server = new ExpressDriver(logger, hashDriver, cors);
    const { post } = server;
    const postController = new PostController({ logger, useCase });
    const result = post('/post', postController);

    expect(result).equal(undefined);
  });

  it('should register a put route', () => {
    const logger = sandbox.createStubInstance(PinoDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const server = new ExpressDriver(logger, hashDriver, cors);
    const { put } = server;
    const putController = new PutController({ logger, useCase });
    const result = put('/put/:id', putController);

    expect(result).equal(undefined);
  });

  it('should register a delete route', () => {
    const logger = sandbox.createStubInstance(PinoDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const server = new ExpressDriver(logger, hashDriver, cors);
    const { delete: del } = server;
    const deleteController = new DeleteController({ logger, useCase });
    const result = del('/delete', deleteController);

    expect(result).equal(undefined);
  });

  it('should start the server with default cors options and port', () => {
    const logger = sandbox.createStubInstance(PinoDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const server = new ExpressDriver(logger, hashDriver);

    sandbox.stub(Server.prototype, 'address').returns({
      address: '0.0.0.0',
      family: 'family',
      port,
    });

    const result = server.start();

    expect(result).equal(undefined);

    setTimeout(() => server.stop());
  });

  it('should start the server with custom cors options and port', () => {
    const logger = sandbox.createStubInstance(PinoDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const server = new ExpressDriver(logger, hashDriver, cors);

    sandbox.stub(Server.prototype, 'address').returns({
      address: '::',
      family: 'family',
      port,
    });

    const result = server.start(port);

    expect(result).equal(undefined);

    setTimeout(() => server.stop());
  });

  it('should stop the server', () => {
    const logger = sandbox.createStubInstance(PinoDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const server = new ExpressDriver(logger, hashDriver, cors);

    sandbox.stub(Server.prototype, 'address').returns({
      address: '0.0.0.0',
      family: 'family',
      port,
    });

    server.start(port);

    const result = server.stop();

    expect(result).equal(undefined);
  });

  it('should log server error', () => {
    const logger = sandbox.createStubInstance(PinoDriver);
    const hashDriver = sandbox.createStubInstance(CryptoDriver);
    const server = new ExpressDriver(logger, hashDriver, cors);
    const error = new Error('test');

    sandbox.stub(Server.prototype, 'address').returns({
      address: '0.0.0.0',
      family: 'family',
      port,
    });

    const serverClose = Server.prototype.close;

    Server.prototype.close = (callback?: (error?: Error) => void): Server => {
      const any: any = {}

      server.httpServer?.emit('error', error);

      return any;
    }

    server.start(port);

    try {
      server.stop();
    } finally {
      expect(logger.fatal.calledOnceWith(error)).equal(
        true,
      );

      Server.prototype.close = serverClose

      server.stop()
    }
  });

  describe('Endpoints', () => {
    let server: IServer;
    const logger = sinon.createStubInstance(PinoDriver);

    before(() => {
      const hashDriver = sinon.createStubInstance(CryptoDriver);

      hashDriver.generateID.returns(faker.string.uuid());

      server = new ExpressDriver(logger, hashDriver, cors);

      sandbox.stub(Server.prototype, 'address').returns({
        address: '0.0.0.0',
        family: 'family',
        port,
      });

      server.start(port);
    });

    after(() => server.stop());

    it('should get status 200 when get request is ok', async () => {
      const getController = new GetController({ logger, useCase });

      server.get('/get', getController);

      const result = await axios.get('http://localhost:8080/get?test=ok');

      expect(result.status).equal(200);
      expect(result.data).deep.equal({ test: 'ok' });
    });

    it('should get status 201 when post request is ok', async () => {
      const postController = new PostController({ logger, useCase });

      server.post('/post', postController);

      const payload = { test: 'ok', user: { userId: faker.string.uuid() } };
      const result = await axios.post('http://localhost:8080/post', payload);

      expect(result.status).equal(201);
      expect(result.data).deep.equal(payload);
    });

    it('should get status 200 when put request is ok', async () => {
      const putController = new PutController({ logger, useCase });

      server.put('/put/:id', putController);

      const result = await axios.put('http://localhost:8080/put/123');

      expect(result.status).equal(200);
      expect(result.data).deep.equal({ id: '123' });
    });

    it('should get status 204 when delete request is ok', async () => {
      const deleteController = new DeleteController({ logger, useCase });

      server.delete('/delete', deleteController);

      const result = await axios.delete('http://localhost:8080/delete');

      expect(result.status).equal(204);
    });

    it('should get status 404 when trying to send request to an invalid URL', async () => {
      await axios
        .get('http://localhost:8080/404')
        .catch(({ response: { status, data } }) => {
          expect(status).equal(404);
          expect(data.error).equal('Invalid URL');
        });
    });

    it('should get status 400 when trying to send request to an URL with validation error', async () => {
      const badRequestErrorController = new ErrorController({
        logger,
        useCase: badRequestErrorUseCase,
      });

      server.get('/400', badRequestErrorController);

      await axios
        .get('http://localhost:8080/400')
        .catch(({ response: { status, data } }) => {
          expect(status).equal(400);
          expect(data.error).equal('Bad Request');
        });
    });

    it('should get status 500 when trying to send request to an URL with internal error', async () => {
      const internalServerErrorController = new ErrorController({
        logger,
        useCase: internalServerErrorUseCase,
      });

      server.get('/500', internalServerErrorController);

      await axios
        .get('http://localhost:8080/500')
        .catch(({ response: { status, data } }) => {
          expect(status).equal(500);
          expect(data.error).equal('Internal Server Error');
        });
    });

    it('should get status 500 when trying to send request to an URL with custom error', async () => {
      const errorController = new ErrorController({
        logger,
        useCase: errorUseCase,
      });

      server.get('/500/error', errorController);

      await axios
        .get('http://localhost:8080/500/error')
        .catch(({ response: { status, data } }) => {
          expect(status).equal(500);
          expect(data.error).equal('Error');
        });
    });
  });
});
