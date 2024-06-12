import sinon from 'sinon';
import { expect } from 'chai';
import pino from 'pino';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

const sandbox = sinon.createSandbox();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerStub: any = sandbox.stub(pino);

describe('/src/infra/drivers/logger/PinoDriver.ts', () => {
  afterEach(() => sandbox.restore());

  it('should log string at debug level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.debug = sandbox.spy();

    const data = 'ok';
    const result = pinoDriver.debug(data);

    expect(result).equal(undefined);
    expect(loggerStub.debug.calledOnceWith(data)).equal(true);
  });

  it('should log object at debug level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.debug = sandbox.spy();

    const obj = { test: 'ok' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(loggerStub.debug.calledOnceWith(obj)).equal(true);
  });

  it('should log string at info level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.info = sandbox.spy();

    const data = 'ok';
    const result = pinoDriver.info(data);

    expect(result).equal(undefined);
    expect(loggerStub.info.calledOnceWith(data)).equal(true);
  });

  it('should log object at info level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.info = sandbox.spy();

    const obj = { test: 'ok' };
    const result = pinoDriver.info(obj);

    expect(result).equal(undefined);
    expect(loggerStub.info.calledOnceWith(obj)).equal(true);
  });

  it('should log string at warn level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.warn = sandbox.spy();

    const data = 'ok';
    const result = pinoDriver.warn(data);

    expect(result).equal(undefined);
    expect(loggerStub.warn.calledOnceWith(data)).equal(true);
  });

  it('should log object at warn level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.warn = sandbox.spy();

    const obj = { test: 'ok' };
    const result = pinoDriver.warn(obj);

    expect(result).equal(undefined);
    expect(loggerStub.warn.calledOnceWith(obj)).equal(true);
  });

  it('should log string at error level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.error = sandbox.spy();

    const data = 'ok';
    const result = pinoDriver.error(data);

    expect(result).equal(undefined);
    expect(loggerStub.error.calledOnceWith(data)).equal(true);
  });

  it('should log object at error level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.error = sandbox.spy();

    const obj = { test: 'ok' };
    const result = pinoDriver.error(obj);

    expect(result).equal(undefined);
    expect(loggerStub.error.calledOnceWith(obj)).equal(true);
  });

  it('should log string at fatal level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.fatal = sandbox.spy();

    const data = 'ok';
    const result = pinoDriver.fatal(data);

    expect(result).equal(undefined);
    expect(loggerStub.fatal.calledOnceWith(data)).equal(true);
  });

  it('should log object at fatal level', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.fatal = sandbox.spy();

    const obj = { test: 'ok' };
    const result = pinoDriver.fatal(obj);

    expect(result).equal(undefined);
    expect(loggerStub.fatal.calledOnceWith(obj)).equal(true);
  });

  it('should map "message" to "msg" in data object', () => {
    const pinoDriver = new PinoDriver('development', loggerStub);

    loggerStub.debug = sandbox.spy();

    const obj = { message: 'ok' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(loggerStub.debug.calledOnceWith({ msg: 'ok' })).equal(true);
  });

  it('should obfuscate "password" in data object', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.debug = sandbox.spy();

    const obj = { password: 'password' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(loggerStub.debug.calledOnceWith({ password: '********' })).equal(
      true,
    );
  });

  it('should obfuscate "confirm_password" in data object', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.debug = sandbox.spy();

    const obj = { confirm_password: 'password' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(
      loggerStub.debug.calledOnceWith({ confirm_password: '********' }),
    ).equal(true);
  });

  it('should obfuscate "email" in data object', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);

    loggerStub.debug = sandbox.spy();

    const obj = { email: 'test@email.com' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(loggerStub.debug.calledOnceWith({ email: '****@email.com' })).equal(
      true,
    );
  });

  it('should obfuscate data when start is lesser than 0', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);
    const result = pinoDriver.obfuscate('test', -1);

    expect(result).equal('****');
  });

  it('should obfuscate data when start is greater than data length', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);
    const result = pinoDriver.obfuscate('test', 100);

    expect(result).equal('****');
  });

  it('should obfuscate data when end is lesser than 0', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);
    const result = pinoDriver.obfuscate('test', 0, -1);

    expect(result).equal('****');
  });

  it('should obfuscate data when end is greater than data length', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);
    const result = pinoDriver.obfuscate('test', 0, 100);

    expect(result).equal('****');
  });

  it('should not obfuscate when data is not an object', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);
    const result = pinoDriver.obfuscateData('test');

    expect(result).equal(undefined);
  });

  it('should not obfuscate when object attribute is empty', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);
    const data = { test: '' };
    const result = pinoDriver.obfuscateData(data);

    expect(result).equal(undefined);
  });

  it('should not obfuscate when object attribute inside data is empty', () => {
    const pinoDriver = new PinoDriver('debug', loggerStub);
    const data = { test: { test: '' } };
    const result = pinoDriver.obfuscateData(data);

    expect(result).equal(undefined);
  });
});
