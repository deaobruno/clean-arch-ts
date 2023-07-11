import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import InMemoryDriver from '../../../../../src/infra/drivers/InMemoryDriver'
import UserRepository from '../../../../../src/adapters/repositories/UserRepository'
import IRepository from '../../../../../src/domain/repositories/IRepository'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import AuthenticateUser from '../../../../../src/application/use_cases/auth/AuthenticateUser'
import { User } from '../../../../../src/domain/User'
import JwtDriver from '../../../../../src/infra/drivers/JwtDriver'
import UnauthorizedError from '../../../../../src/application/errors/UnauthorizedError'
import BaseError from '../../../../../src/application/BaseError'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository<any>
let tokenDriver: JwtDriver
let userRepository: IUserRepository
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
    userRepository = new UserRepository(inMemoryDriver)
    tokenDriver = new JwtDriver('token', 60)
    authenticateUser = new AuthenticateUser(userRepository, tokenDriver)
    unauthorizedError = sandbox.stub(UnauthorizedError.prototype)
    userId = faker.string.uuid()
    email = faker.internet.email()
    password = faker.internet.password()
    fakeUser = {
      user_id: userId,
      email,
      password,
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

  it('should return a JWT token', async () => {
    sandbox.stub(UserRepository.prototype, 'findOneByEmail')
      .resolves(fakeUser)

    const { token } = <any>await authenticateUser.exec(userData)

    expect(typeof token).equal('string')
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
