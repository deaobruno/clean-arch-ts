import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import InMemoryDriver from '../../../../../src/infra/drivers/InMemoryDriver'
import UserRepository from '../../../../../src/adapters/repositories/UserRepository'
import RefreshTokenRepository from '../../../../../src/adapters/repositories/RefreshTokenRepository'
import IRepository from '../../../../../src/domain/repositories/IRepository'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import AuthenticateUser from '../../../../../src/application/use_cases/auth/AuthenticateUser'
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
let userRepository: IUserRepository
let refreshTokenRepository: IRefreshTokenRepository
let authenticateUser: AuthenticateUser
let unauthorizedError: UnauthorizedError
let userData: any
let userId: string
let email: string
let password: string
let fakeUser: User

describe('/application/use_cases/auth/AuthenticateUser.ts', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    tokenDriver = new JwtDriver('access-token-key', 300, 'refresh-token-key', 900)
    cryptoDriver = {
      generateID: () => faker.string.uuid(),
      hashString: (text: string) => 'hash',
    }
    userRepository = new UserRepository(inMemoryDriver)
    refreshTokenRepository = new RefreshTokenRepository(inMemoryDriver)
    authenticateUser = new AuthenticateUser(userRepository, refreshTokenRepository, tokenDriver, cryptoDriver)
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

  it('should return a JWT access token and a JWT refresh token', async () => {
    sandbox.stub(JwtDriver.prototype, 'generateAccessToken')
      .returns('token')
    sandbox.stub(JwtDriver.prototype, 'generateRefreshToken')
      .returns('token')
    sandbox.stub(UserRepository.prototype, 'findOneByEmail')
      .resolves(fakeUser)
    sandbox.stub(RefreshTokenRepository.prototype, 'save')
      .resolves()

    const { accessToken, refreshToken } = <any>await authenticateUser.exec(userData)

    expect(typeof accessToken).equal('string')
    expect(typeof refreshToken).equal('string')
  })

  it('should return an UnauthorizedError when user is not found', async () => {
    sandbox.stub(UserRepository.prototype, 'findOneByEmail')
      .resolves()

    const error = <BaseError>await authenticateUser.exec(userData)

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Unauthorized')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when given password is different from found user password', async () => {
    fakeUser.password = 'test'

    sandbox.stub(UserRepository.prototype, 'findOneByEmail')
      .resolves(fakeUser)

    const error = <BaseError>await authenticateUser.exec(userData)

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Unauthorized')
    expect(error.statusCode).equal(401)
  })
})
