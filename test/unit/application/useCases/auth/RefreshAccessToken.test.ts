import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import RefreshAccessToken from '../../../../../src/application/useCases/auth/RefreshAccessToken'
import BaseError from '../../../../../src/application/errors/BaseError'
import TokenDriverMock from '../../../../mocks/drivers/TokenDriverMock'
import RefreshTokenRepositoryMock from '../../../../mocks/repositories/inMemory/InMemoryRefreshTokenRepositoryMock'
import ITokenDriver from '../../../../../src/infra/drivers/token/ITokenDriver'
import IRefreshTokenRepository from '../../../../../src/domain/repositories/IRefreshTokenRepository'
import { LevelEnum } from '../../../../../src/domain/User'
import ForbiddenError from '../../../../../src/application/errors/ForbiddenError'

const sandbox = sinon.createSandbox()
const tokenDriver: ITokenDriver = TokenDriverMock
const refreshTokenRepository: IRefreshTokenRepository = RefreshTokenRepositoryMock
const userId = faker.string.uuid()
const userData = {
  userId,
  email: faker.internet.email(),
  password: faker.internet.password(),
  level: LevelEnum.CUSTOMER,
}
const user = {
  ...userData,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
}
const refreshAccessToken = new RefreshAccessToken(tokenDriver, refreshTokenRepository)
let forbiddenError: BaseError

describe('/application/useCases/auth/RefreshAccessToken.ts', () => {
  before(() => {
    forbiddenError = sandbox.stub(ForbiddenError.prototype)
    forbiddenError.name = 'ForbiddenError'
    forbiddenError.statusCode = 403
    forbiddenError.message = 'Forbidden'
  })

  afterEach(() => sandbox.restore())

  it('should return a JWT access token', async () => {
    sandbox.stub(refreshTokenRepository, 'findOneByToken')
      .resolves({ userId, token: 'refresh-token' })
    sandbox.stub(tokenDriver, 'validateRefreshToken')
      .returns(userData)

    const { accessToken } = <any>await refreshAccessToken.exec({ user, refresh_token: 'refresh-token' })

    expect(typeof accessToken).equal('string')
  })

  it('should fail when there is no previous refresh token', async () => {
    sandbox.stub(tokenDriver, 'validateRefreshToken')
      .returns(userData)

    const error = <BaseError>await refreshAccessToken.exec({ user, refresh_token: 'refresh-token' })

    expect(error instanceof ForbiddenError).equal(true)
    expect(error.message).equal('Refresh token not found')
    expect(error.statusCode).equal(403)
  })

  it('should fail when refresh token is expired', async () => {
    sandbox.stub(refreshTokenRepository, 'findOneByToken')
      .resolves({ userId, token: 'refresh-token' })
    sandbox.stub(tokenDriver, 'validateRefreshToken')
      .throws({ name: 'TokenExpiredError' })

    const error = <BaseError>await refreshAccessToken.exec({ user, refresh_token: 'refresh-token' })

    expect(error instanceof ForbiddenError).equal(true)
    expect(error.message).equal('Refresh token expired')
    expect(error.statusCode).equal(403)
  })

  it('should fail when refresh token is invalid', async () => {
    sandbox.stub(refreshTokenRepository, 'findOneByToken')
      .resolves({ userId, token: 'refresh-token' })
    sandbox.stub(tokenDriver, 'validateRefreshToken')
      .throws({})

    const error = <BaseError>await refreshAccessToken.exec({ user, refresh_token: 'refresh-token' })

    expect(error instanceof ForbiddenError).equal(true)
    expect(error.message).equal('Invalid refresh token')
    expect(error.statusCode).equal(403)
  })

  it('should return ForbiddenError when authenticated user is different from token user', async () => {
    sandbox.stub(refreshTokenRepository, 'findOneByToken')
      .resolves({ userId: faker.string.uuid(), token: 'refresh-token' })

    const error = <BaseError>await refreshAccessToken.exec({ user, refresh_token: 'refresh-token' })

    expect(error instanceof ForbiddenError).equal(true)
    expect(error.message).equal('Token does not belong to user')
    expect(error.statusCode).equal(403)
  })
})
