import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import PinoDriver from '../../../../src/infra/drivers/logger/PinoDriver';
import RefreshTokenMapper from '../../../../src/domain/refreshToken/RefreshTokenMapper';
import RefreshToken from '../../../../src/domain/refreshToken/RefreshToken';

const refreshTokenMapper = new RefreshTokenMapper(
  sinon.createStubInstance(PinoDriver),
);

describe('/src/domain/refreshToken/RefreshTokenMapper.ts', () => {
  it('should map a refreshToken entity to refreshToken db data', () => {
    const refreshTokenData = {
      userId: faker.string.uuid(),
      token: faker.string.alphanumeric(64),
    };
    const refreshToken = <RefreshToken>RefreshToken.create(refreshTokenData);
    const refreshTokenDbData = refreshTokenMapper.entityToDb(refreshToken);

    expect(refreshTokenDbData.user_id).equal(refreshToken.userId);
    expect(refreshTokenDbData.token).equal(refreshToken.token);
  });

  it('should map refreshToken db data to a refreshToken entity', () => {
    const userId = faker.string.uuid();
    const token = faker.string.alphanumeric(64);

    sinon.stub(RefreshToken, 'create').returns({
      userId,
      token,
    });

    const refreshTokenDbData = {
      user_id: userId,
      token,
    };
    const user = <RefreshToken>(
      refreshTokenMapper.dbToEntity(refreshTokenDbData)
    );

    expect(user.userId).equal(refreshTokenDbData.user_id);
    expect(user.token).equal(refreshTokenDbData.token);

    sinon.restore();
  });
});
