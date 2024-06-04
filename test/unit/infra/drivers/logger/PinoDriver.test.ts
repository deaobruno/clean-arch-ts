import sinon from 'sinon';
import { expect } from 'chai';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

const sandbox = sinon.createSandbox();
const debugSpy = sinon.spy();
const infoSpy = sinon.spy();
const warnSpy = sinon.spy();
const errorSpy = sinon.spy();
const fatalSpy = sinon.spy();

describe('/src/infra/drivers/logger/PinoDriver.ts', () => {
  afterEach(() => sandbox.restore());

  it('should log string at debug level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.debug = debugSpy;

    const data = 'ok';
    const result = pinoDriver.debug(data);

    expect(result).equal(undefined);
    expect(debugSpy.calledWith(data)).equal(true);
  });

  it('should log object at debug level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.debug = debugSpy;

    const obj = { test: 'ok' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(debugSpy.calledWith(obj)).equal(true);
  });

  it('should log string at info level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.info = infoSpy;

    const data = 'ok';
    const result = pinoDriver.info(data);

    expect(result).equal(undefined);
    expect(infoSpy.calledWith(data)).equal(true);
  });

  it('should log object at info level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.info = infoSpy;

    const obj = { test: 'ok' };
    const result = pinoDriver.info(obj);

    expect(result).equal(undefined);
    expect(infoSpy.calledWith(obj)).equal(true);
  });

  it('should log string at warn level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.warn = warnSpy;

    const data = 'ok';
    const result = pinoDriver.warn(data);

    expect(result).equal(undefined);
    expect(warnSpy.calledWith(data)).equal(true);
  });

  it('should log object at warn level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.warn = warnSpy;

    const obj = { test: 'ok' };
    const result = pinoDriver.warn(obj);

    expect(result).equal(undefined);
    expect(warnSpy.calledWith(obj)).equal(true);
  });

  it('should log string at error level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.error = errorSpy;

    const data = 'ok';
    const result = pinoDriver.error(data);

    expect(result).equal(undefined);
    expect(errorSpy.calledWith(data)).equal(true);
  });

  it('should log object at error level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.error = errorSpy;

    const obj = { test: 'ok' };
    const result = pinoDriver.error(obj);

    expect(result).equal(undefined);
    expect(errorSpy.calledWith(obj)).equal(true);
  });

  it('should log string at fatal level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.fatal = fatalSpy;

    const data = 'ok';
    const result = pinoDriver.fatal(data);

    expect(result).equal(undefined);
    expect(fatalSpy.calledWith(data)).equal(true);
  });

  it('should log object at fatal level', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.fatal = fatalSpy;

    const obj = { test: 'ok' };
    const result = pinoDriver.fatal(obj);

    expect(result).equal(undefined);
    expect(fatalSpy.calledWith(obj)).equal(true);
  });

  it('should map "message" to "msg" in data object', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.debug = debugSpy;

    const obj = { message: 'ok' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(debugSpy.calledWith({ msg: 'ok' })).equal(true);
  });

  it('should obfuscate "password" in data object', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.debug = debugSpy;

    const obj = { password: 'password' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(debugSpy.calledWith({ password: '********' })).equal(true);
  });

  it('should obfuscate "confirm_password" in data object', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.debug = debugSpy;

    const obj = { confirm_password: 'password' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(debugSpy.calledWith({ confirm_password: '********' })).equal(true);
  });

  it('should obfuscate "email" in data object', () => {
    const pinoDriver = new PinoDriver();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerStub = sinon.stub((pinoDriver as any).logger);

    loggerStub.debug = debugSpy;

    const obj = { email: 'test@email.com' };
    const result = pinoDriver.debug(obj);

    expect(result).equal(undefined);
    expect(debugSpy.calledWith({ email: '****@email.com' })).equal(true);
  });

  it('should obfuscate data when start is lesser than 0', () => {
    const pinoDriver = new PinoDriver();
    const result = pinoDriver.obfuscate('test', -1);

    expect(result).equal('****');
  });

  it('should obfuscate data when start is greater than data length', () => {
    const pinoDriver = new PinoDriver();
    const result = pinoDriver.obfuscate('test', 100);

    expect(result).equal('****');
  });

  it('should obfuscate data when end is lesser than 0', () => {
    const pinoDriver = new PinoDriver();
    const result = pinoDriver.obfuscate('test', 0, -1);

    expect(result).equal('****');
  });

  it('should obfuscate data when end is greater than data length', () => {
    const pinoDriver = new PinoDriver();
    const result = pinoDriver.obfuscate('test', 0, 100);

    expect(result).equal('****');
  });

  it('should not obfuscate when data is not an object', () => {
    const pinoDriver = new PinoDriver();
    const result = pinoDriver.obfuscateData('test');

    expect(result).equal('test');
  });

  it('should not obfuscate when object attribute is empty', () => {
    const pinoDriver = new PinoDriver();
    const data = { test: '' }
    const result = pinoDriver.obfuscateData(data);

    expect(result).equal(undefined);
  });

  it('should not obfuscate when object attribute inside data is empty', () => {
    const pinoDriver = new PinoDriver();
    const data = { test: { test: '' } }
    const result = pinoDriver.obfuscateData(data);

    expect(result).equal(undefined);
  });
});
