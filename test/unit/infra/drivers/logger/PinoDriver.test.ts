import sinon from 'sinon';
import { expect } from 'chai';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

const sandbox = sinon.createSandbox();
const infoSpy = sinon.spy();
const errorSpy = sinon.spy();
const fatalSpy = sinon.spy();

describe('/src/infra/drivers/logger/PinoDriver.ts', () => {
  afterEach(() => sandbox.restore());

  it('should log data at info level', () => {
    const pinoDriver = new PinoDriver('debug');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.info = infoSpy;

    const obj = { test: 'ok' };
    const result = pinoDriver.info(obj);

    expect(result).equal(undefined);
    expect(infoSpy.calledWith(obj)).equal(true);
  });

  it('should log data at error level', () => {
    const pinoDriver = new PinoDriver('debug');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.error = errorSpy;

    const obj = { test: 'ok' };
    const result = pinoDriver.error(obj);

    expect(result).equal(undefined);
    expect(errorSpy.calledWith(obj)).equal(true);
  });

  it('should log data at fatal level', () => {
    const pinoDriver = new PinoDriver('debug');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.fatal = fatalSpy;

    const obj = { test: 'ok' };
    const result = pinoDriver.fatal(obj);

    expect(result).equal(undefined);
    expect(fatalSpy.calledWith(obj)).equal(true);
  });
});
