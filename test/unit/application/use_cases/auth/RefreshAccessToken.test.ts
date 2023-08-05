import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import RefreshAccessToken from '../../../../../src/application/use_cases/auth/RefreshAccessToken'
import UnauthorizedError from '../../../../../src/application/errors/UnauthorizedError'
import BaseError from '../../../../../src/application/errors/BaseError'
import TokenDriverMock from '../../../../mocks/drivers/TokenDriverMock'
import RefreshTokenRepositoryMock from '../../../../mocks/repositories/RefreshTokenRepositoryMock'
import ITokenDriver from '../../../../../src/infra/drivers/token/ITokenDriver'
import IRefreshTokenRepository from '../../../../../src/domain/repositories/IRefreshTokenRepository'

const sandbox = sinon.createSandbox()
const tokenDriver: ITokenDriver = TokenDriverMock
const refreshTokenRepository: IRefreshTokenRepository = RefreshTokenRepositoryMock
const userId = faker.string.uuid()
const userData = {
  userId,
  email: faker.internet.email(),
  password: faker.internet.password(),
  level: 2,
}
const refreshAccessToken = new RefreshAccessToken(tokenDriver, refreshTokenRepository)
let unauthorizedError: BaseError

describe('/application/use_cases/auth/RefreshAccessToken.ts', () => {
  before(() => {
    unauthorizedError = sandbox.stub(UnauthorizedError.prototype)
    unauthorizedError.name = 'UnauthorizedError'
    unauthorizedError.statusCode = 401
    unauthorizedError.message = 'Unauthorized'
  })

  afterEach(() => sandbox.restore())

  it('should return a JWT access token', async () => {
    sandbox.stub(refreshTokenRepository, 'findOne')
      .resolves({ user_id: userId, token: 'refresh-token' })
    sandbox.stub(tokenDriver, 'validateRefreshToken')
      .returns(userData)

    const { accessToken } = <any>await refreshAccessToken.exec({ refreshToken: 'refresh-token' })

    expect(typeof accessToken).equal('string')
  })

  it('should fail when there is no previous refresh token', async () => {
    sandbox.stub(tokenDriver, 'validateRefreshToken')
      .returns(userData)

    const error = <BaseError>await refreshAccessToken.exec({ refreshToken: 'refresh-token' })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Refresh token not found')
    expect(error.statusCode).equal(401)
  })

  it('should fail when refresh token is expired', async () => {
    sandbox.stub(refreshTokenRepository, 'findOne')
      .resolves({ user_id: userId, token: 'refresh-token' })
    sandbox.stub(tokenDriver, 'validateRefreshToken')
      .throws({ name: 'TokenExpiredError' })

    const error = <BaseError>await refreshAccessToken.exec({ refreshToken: 'refresh-token' })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Refresh token expired')
    expect(error.statusCode).equal(401)
  })

  it('should fail when refresh token is invalid', async () => {
    sandbox.stub(refreshTokenRepository, 'findOne')
      .resolves({ user_id: userId, token: 'refresh-token' })
    sandbox.stub(tokenDriver, 'validateRefreshToken')
      .throws({})

    const error = <BaseError>await refreshAccessToken.exec({ refreshToken: 'refresh-token' })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Invalid refresh token')
    expect(error.statusCode).equal(401)
  })
})
