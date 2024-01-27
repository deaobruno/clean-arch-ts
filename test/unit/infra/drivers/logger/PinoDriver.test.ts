import sinon from "sinon";
import PinoDriver from "../../../../../src/infra/drivers/logger/PinoDriver";
import { expect } from "chai";

const sandbox = sinon.createSandbox();
const infoSpy = sinon.spy();
const errorSpy = sinon.spy();
const fatalSpy = sinon.spy();

describe("/src/infra/drivers/logger/PinoDriver.ts", () => {
  afterEach(() => sandbox.restore());

  it("should log data at info level", () => {
    const pinoDriver = new PinoDriver();
    const loggerStub = sinon.stub((pinoDriver as any)._logger);

    loggerStub.info = infoSpy;

    const obj = { test: "ok" };
    const result = pinoDriver.info(obj);

    expect(result).equal(undefined);
    expect(infoSpy.calledWith(obj)).equal(true);
  });

  it("should log data at error level", () => {
    const pinoDriver = new PinoDriver();
    const loggerStub = sinon.stub((pinoDriver as any)._logger);

    loggerStub.error = errorSpy;

    const obj = { test: "ok" };
    const result = pinoDriver.error(obj);

    expect(result).equal(undefined);
    expect(errorSpy.calledWith(obj)).equal(true);
  });

  it("should log data at fatal level", () => {
    const pinoDriver = new PinoDriver();
    const loggerStub = sinon.stub((pinoDriver as any)._logger);

    loggerStub.fatal = fatalSpy;

    const obj = { test: "ok" };
    const result = pinoDriver.fatal(obj);

    expect(result).equal(undefined);
    expect(fatalSpy.calledWith(obj)).equal(true);
  });
});
