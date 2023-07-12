import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import InMemoryDriver from '../../../../../src/infra/drivers/InMemoryDriver'
import RefreshTokenRepository from '../../../../../src/adapters/repositories/RefreshTokenRepository'
import IRepository from '../../../../../src/domain/repositories/IRepository'
import RefreshAccessToken from '../../../../../src/application/use_cases/auth/RefreshAccessToken'
import { User } from '../../../../../src/domain/User'
import JwtDriver from '../../../../../src/infra/drivers/JwtDriver'
import UnauthorizedError from '../../../../../src/application/errors/UnauthorizedError'
import BaseError from '../../../../../src/application/BaseError'
import CryptoDriver from '../../../../../src/infra/drivers/CryptoDriver'
import IRefreshTokenRepository from '../../../../../src/domain/repositories/IRefreshTokenRepository'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository<any>
let tokenDriver: JwtDriver
let cryptoDriver: CryptoDriver
let refreshTokenRepository: IRefreshTokenRepository
let refreshAccessToken: RefreshAccessToken
let unauthorizedError: UnauthorizedError
let userData: any
let userId: string
let email: string
let password: string
let fakeUser: User

describe('/application/use_cases/auth/RefreshAccessToken.ts', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    tokenDriver = new JwtDriver('access-token-key', 300, 'refresh-token-key', 900)
    cryptoDriver = {
      generateID: () => faker.string.uuid(),
      hashString: (text: string) => 'hash',
    }
    refreshTokenRepository = new RefreshTokenRepository(inMemoryDriver)
    refreshAccessToken = new RefreshAccessToken(tokenDriver, refreshTokenRepository)
    unauthorizedError = sandbox.stub(UnauthorizedError.prototype)
    userId = faker.string.uuid()
    email = faker.internet.email()
    password = faker.internet.password()
    fakeUser = {
      user_id: userId,
      email,
      password: cryptoDriver.hashString(password),
      level: 2,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    }
    userData = {
      userId,
      email,
      password,
      level: 2,
    }
    unauthorizedError.name = 'UnauthorizedError'
    unauthorizedError.statusCode = 401
    unauthorizedError.message = 'Unauthorized'
  })

  afterEach(() => sandbox.restore())

  it('should return a JWT access token', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves({ token: 'refresh-token' })
    sandbox.stub(JwtDriver.prototype, 'validateRefreshToken')
      .returns(userData)
    sandbox.stub(JwtDriver.prototype, 'generateAccessToken')
      .returns('token')

    const { accessToken } = <any>await refreshAccessToken.exec({ refreshToken: 'refresh-token' })

    expect(typeof accessToken).equal('string')
  })

  it('should fail when there is no previous refresh token', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves()
    sandbox.stub(JwtDriver.prototype, 'validateRefreshToken')
      .returns(userData)
    sandbox.stub(JwtDriver.prototype, 'generateAccessToken')
      .returns('token')

    const error = <BaseError>await refreshAccessToken.exec({ refreshToken: 'refresh-token' })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Refresh token not found')
    expect(error.statusCode).equal(401)
  })

  it('should fail when refresh token is expired', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves({ token: 'refresh-token' })
    sandbox.stub(JwtDriver.prototype, 'validateRefreshToken')
      .throws({ name: 'TokenExpiredError' })
    sandbox.stub(JwtDriver.prototype, 'generateAccessToken')
      .returns('token')

    const error = <BaseError>await refreshAccessToken.exec({ refreshToken: 'refresh-token' })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Refresh token expired')
    expect(error.statusCode).equal(401)
  })

  it('should fail when refresh token is invalid', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves({ token: 'refresh-token' })
    sandbox.stub(JwtDriver.prototype, 'validateRefreshToken')
      .throws({})
    sandbox.stub(JwtDriver.prototype, 'generateAccessToken')
      .returns('token')

    const error = <BaseError>await refreshAccessToken.exec({ refreshToken: 'refresh-token' })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Invalid refresh token')
    expect(error.statusCode).equal(401)
  })
})
