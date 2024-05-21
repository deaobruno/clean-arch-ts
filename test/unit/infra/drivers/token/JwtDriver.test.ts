import sinon from 'sinon';
import { expect } from 'chai';
import JwtDriver from '../../../../../src/infra/drivers/token/JwtDriver';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

const loggerDriver = sinon.createStubInstance(PinoDriver);
const jwtDriver = new JwtDriver(
  loggerDriver,
  'access-token-key',
  300,
  'refresh-token-key',
  900,
);
const tokenData = { test: true };
let accessToken: string;
let refreshToken: string;

describe('/infra/drivers/JwtDriver.ts', () => {
  it('should generate a JWT access token passing an object with data', () => {
    accessToken = jwtDriver.generateAccessToken(tokenData);

    expect(typeof accessToken).equal('string');
  });

  it('should generate a JWT refresh token passing an object with data', () => {
    refreshToken = jwtDriver.generateRefreshToken(tokenData);

    expect(typeof refreshToken).equal('string');
  });

  it('should return the data from a JWT access token', () => {
    const data = jwtDriver.validateAccessToken(accessToken);

    expect(data).deep.equal(tokenData);
  });

  it('should return the data from a JWT refresh token', () => {
    const data = jwtDriver.validateRefreshToken(refreshToken);

    expect(data).deep.equal(tokenData);
  });
});
