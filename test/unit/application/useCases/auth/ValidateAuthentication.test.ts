import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ValidateAuthentication from '../../../../../src/application/useCases/auth/ValidateAuthentication'
import { LevelEnum, User } from '../../../../../src/domain/User'
import UnauthorizedError from '../../../../../src/application/errors/UnauthorizedError'
import BaseError from '../../../../../src/application/errors/BaseError'
import IRefreshTokenRepository from '../../../../../src/domain/repositories/IRefreshTokenRepository'
import TokenDriverMock from '../../../../mocks/drivers/TokenDriverMock'
import ITokenDriver from '../../../../../src/infra/drivers/token/ITokenDriver'
import RefreshTokenRepositoryMock from '../../../../mocks/repositories/inMemory/InMemoryRefreshTokenRepositoryMock'

const sandbox = sinon.createSandbox()
const tokenDriver: ITokenDriver = TokenDriverMock
const refreshTokenRepository: IRefreshTokenRepository = RefreshTokenRepositoryMock
const validateAuthentication = new ValidateAuthentication(tokenDriver, refreshTokenRepository)
const userId = faker.string.uuid()
const email = faker.internet.email()
const password = faker.internet.password()
const userData = {
  id: userId,
  email,
  password,
  level: LevelEnum.CUSTOMER,
}
const fakeUser = {
  userId,
  email,
  password,
  level: LevelEnum.CUSTOMER,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
}
let unauthorizedError: UnauthorizedError

describe('/application/useCases/auth/ValidateAuthentication.ts', () => {
  beforeEach(() => {
    unauthorizedError = sandbox.stub(UnauthorizedError.prototype)
    unauthorizedError.name = 'UnauthorizedError'
    unauthorizedError.statusCode = 401
    unauthorizedError.message = 'Unauthorized'
  })

  afterEach(() => sandbox.restore())

  it('should return authenticated user entity', async () => {
    sandbox.stub(tokenDriver, 'validateAccessToken')
      .returns(userData)
    sandbox.stub(refreshTokenRepository, 'findOneByUserId')
      .resolves({ userId: userId, token: 'token' })
    sandbox.stub(User, 'create')
      .returns(fakeUser)

    const authorization = 'Bearer token'
    const { user } = <any>await validateAuthentication.exec({ authorization })

    expect(user.userId).equal(userData.id)
    expect(user.email).equal(userData.email)
    expect(user.password).equal(userData.password)
    expect(user.level).equal(userData.level)
    expect(user.isCustomer).equal(true)
    expect(user.isAdmin).equal(false)
    expect(user.isRoot).equal(false)
  })

  it('should return an UnauthorizedError when authentication data is empty', async () => {
    const authorization = ''
    const error = <BaseError>await validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('No token provided')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when authentication method is not Bearer Token', async () => {
    const authorization = 'test token'
    const error = <BaseError>await validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Invalid authentication type')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when authentication token is empty', async () => {
    const authorization = 'Bearer'
    const error = <BaseError>await validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('No token provided')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when token is expired', async () => {
    sandbox.stub(tokenDriver, 'validateAccessToken')
      .throws({ name: 'TokenExpiredError' })

    const authorization = 'Bearer token'
    const error = <BaseError>await validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Token expired')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when token is invalid', async () => {
    sandbox.stub(tokenDriver, 'validateAccessToken')
      .throws({})

    const authorization = 'Bearer token'
    const error = <BaseError>await validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Invalid token')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when no refresh token is found for user', async () => {
    sandbox.stub(tokenDriver, 'validateAccessToken')
      .returns(userData)
    sandbox.stub(refreshTokenRepository, 'findOneByUserId')
      .resolves()

    const authorization = 'Bearer token'
    const error = <BaseError>await validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Unauthorized')
    expect(error.statusCode).equal(401)
  })
})
