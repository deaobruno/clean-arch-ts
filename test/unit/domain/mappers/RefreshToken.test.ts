import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import { RefreshTokenMapper } from '../../../../src/domain/mappers/RefreshTokenMapper'
import { RefreshToken } from '../../../../src/domain/RefreshToken'

const refreshTokenMapper = new RefreshTokenMapper()

describe('/src/domain/mappers/RefreshTokenMapper.ts', () => {
  it('should map a refreshToken entity to refreshToken db data', () => {
    const refreshTokenData = {
      userId: faker.string.uuid(),
      token: faker.string.alphanumeric(64),
    }
    const refreshToken = RefreshToken.create(refreshTokenData)
    const refreshTokenDbData = refreshTokenMapper.entityToDb(refreshToken)

    expect(refreshTokenDbData.user_id).equal(refreshToken.userId)
    expect(refreshTokenDbData.token).equal(refreshToken.token)
  })

  it('should map refreshToken db data to a refreshToken entity', () => {
    const userId = faker.string.uuid()
    const token = faker.string.alphanumeric(64)

    sinon.stub(RefreshToken, 'create')
      .returns({
        userId,
        token,
      })

    const refreshTokenDbData = {
      user_id: userId,
      token,
    }
    const user = refreshTokenMapper.dbToEntity(refreshTokenDbData)

    expect(user.userId).equal(refreshTokenDbData.user_id)
    expect(user.token).equal(refreshTokenDbData.token)

    sinon.restore()
  })
})
