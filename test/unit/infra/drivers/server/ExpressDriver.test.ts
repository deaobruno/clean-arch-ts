import axios from 'axios';
import { expect } from 'chai';
import sinon from 'sinon';
import config from '../../../../../src/config';
import ExpressDriver from '../../../../../src/infra/drivers/server/ExpressDriver';
import BaseController from '../../../../../src/adapters/controllers/BaseController';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';
import BadRequestError from '../../../../../src/application/errors/BadRequestError';
import { Server } from 'http';

const loggerDriver = sinon.createStubInstance(PinoDriver);
const { cors } = config;
const server = new ExpressDriver(loggerDriver, cors);
const { get, post, put, delete: del } = server;
const useCase = {
  exec: (data: any): Promise<any> => Promise.resolve(data),
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

const getController = new GetController({ useCase });
const postController = new PostController({ useCase });
const putController = new PutController({ useCase });
const deleteController = new DeleteController({ useCase });
const badRequestErrorController = new ErrorController({
  useCase: badRequestErrorUseCase,
});
const internalServerErrorController = new ErrorController({
  useCase: internalServerErrorUseCase,
});
const errorController = new ErrorController({
  useCase: errorUseCase,
});

get('/400', badRequestErrorController);
get('/500', internalServerErrorController);
get('/500/error', errorController);

describe('/infra/drivers/server/ExpressDriver.ts', () => {
  it('should register a get route', () => {
    const result = get('/get', getController);

    expect(result).equal(undefined);
  });

  it('should register a post route', () => {
    const result = post('/post', postController);

    expect(result).equal(undefined);
  });

  it('should register a put route', () => {
    const result = put('/put/:id', putController);

    expect(result).equal(undefined);
  });

  it('should register a delete route', () => {
    const result = del('/delete', deleteController);

    expect(result).equal(undefined);
  });

  it('should start the server passing an array of Routes', () => {
    const port = 8080;

    sinon.stub(Server.prototype, 'address').returns({
      address: '0.0.0.0',
      family: 'family',
      port,
    });

    const result = server.start(port);

    expect(result).equal(undefined);
  });

  it('should get status 200 when get request is ok', async () => {
    const result = await axios.get('http://localhost:8080/get?test=ok');

    expect(result.status).equal(200);
    expect(result.data).deep.equal({ test: 'ok' });
  });

  it('should get status 201 when post request is ok', async () => {
    const payload = { test: 'ok' };
    const result = await axios.post('http://localhost:8080/post', payload);

    expect(result.status).equal(201);
    expect(result.data).deep.equal(payload);
  });

  it('should get status 200 when put request is ok', async () => {
    const result = await axios.put('http://localhost:8080/put/123');

    expect(result.status).equal(200);
    expect(result.data).deep.equal({ id: '123' });
  });

  it('should get status 204 when delete request is ok', async () => {
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
    await axios
      .get('http://localhost:8080/400')
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Bad Request');
      });
  });

  it('should get status 500 when trying to send request to an URL with internal error', async () => {
    await axios
      .get('http://localhost:8080/500')
      .catch(({ response: { status, data } }) => {
        expect(status).equal(500);
        expect(data.error).equal('Internal Server Error');
      });
  });

  it('should get status 500 when trying to send request to an URL with custom error', async () => {
    await axios
      .get('http://localhost:8080/500/error')
      .catch(({ response: { status, data } }) => {
        expect(status).equal(500);
        expect(data.error).equal('Error');
      });
  });

  it('should stop the server', () => {
    const result = server.stop();

    expect(result).equal(undefined);
  });
});
