import sinon from 'sinon';
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import BcryptDriver from '../../../../../src/infra/drivers/encryption/BcryptDriver';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

const sandbox = sinon.createSandbox()
const loggerDriver = sinon.createStubInstance(PinoDriver);
const bcryptDriver = new BcryptDriver(loggerDriver);

describe('/src/infra/drivers/encryption/BcryptDriver.ts', () => {
  afterEach(() => sandbox.restore())

  it('should return a hashed string using bcrypt algorithm', async () => {
    sandbox.stub(bcrypt, 'hash').resolves('hash');

    const result = await bcryptDriver.encrypt('string');

    expect(result).equal('hash');
  });

  it('should return a hashed string using bcrypt algorithm setting custom salt rounds', async () => {
    sandbox.stub(bcrypt, 'hash').resolves('hash');

    const result = await bcryptDriver.encrypt('string', 5);

    expect(result).equal('hash');
  });

  it('should return true when compared string is equal to hashed string', async () => {
    sandbox.stub(bcrypt, 'compare').resolves(true);

    const result = await bcryptDriver.compare('string', 'hash');

    expect(result).equal(true);
  });

  it('should return false when compared string is equal to hashed string', async () => {
    sandbox.stub(bcrypt, 'compare').resolves(false);

    const result = await bcryptDriver.compare('string', 'hash');

    expect(result).equal(false);
  });
});
