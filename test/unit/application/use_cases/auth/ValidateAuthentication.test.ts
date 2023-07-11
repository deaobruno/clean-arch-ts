import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ValidateAuthentication from '../../../../../src/application/use_cases/auth/ValidateAuthentication'
import { User } from '../../../../../src/domain/User'
import JwtDriver from '../../../../../src/infra/drivers/JwtDriver'
import UnauthorizedError from '../../../../../src/application/errors/UnauthorizedError'
import BaseError from '../../../../../src/application/BaseError'

const sandbox = sinon.createSandbox()
let tokenDriver: JwtDriver
let validateAuthentication: ValidateAuthentication
let unauthorizedError: UnauthorizedError
let userData: any
let userId: string
let email: string
let password: string
let fakeUser: User

describe('/application/use_cases/auth/ValidateAuthentication.ts', () => {
  beforeEach(() => {
    tokenDriver = new JwtDriver('token', 60)
    validateAuthentication = new ValidateAuthentication(tokenDriver)
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
      id: userId,
      email,
      password,
      level: 2,
    }
    unauthorizedError.name = 'UnauthorizedError'
    unauthorizedError.statusCode = 401
    unauthorizedError.message = 'Unauthorized'
  })

  afterEach(() => sandbox.restore())

  it('should return authenticated user entity', async () => {
    sandbox.stub(JwtDriver.prototype, 'validate')
      .returns(userData)
    sandbox.stub(User, 'create')
      .returns(fakeUser)

    const authorization = 'Bearer token'
    const { user } = <any>validateAuthentication.exec({ authorization })

    expect(user.user_id).equal(userData.id)
    expect(user.email).equal(userData.email)
    expect(user.password).equal(userData.password)
    expect(user.level).equal(userData.level)
    expect(user.isCustomer).equal(true)
    expect(user.isAdmin).equal(false)
    expect(user.isRoot).equal(false)
  })

  it('should return an UnauthorizedError when authentication data is empty', async () => {
    const authorization = ''
    const error = <BaseError>validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('No token provided')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when authentication method is not Bearer Token', async () => {
    const authorization = 'test token'
    const error = <BaseError>validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Invalid authentication type')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when authentication token is empty', async () => {
    const authorization = 'Bearer'
    const error = <BaseError>validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('No token provided')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when token is expired', async () => {
    sandbox.stub(JwtDriver.prototype, 'validate')
      .throws({ name: 'TokenExpiredError' })

    const authorization = 'Bearer token'
    const error = <BaseError>validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Token expired')
    expect(error.statusCode).equal(401)
  })

  it('should return an UnauthorizedError when token is invalid', async () => {
    sandbox.stub(JwtDriver.prototype, 'validate')
      .throws({ name: 'test' })

    const authorization = 'Bearer token'
    const error = <BaseError>validateAuthentication.exec({ authorization })

    expect(error instanceof UnauthorizedError).equal(true)
    expect(error.message).equal('Invalid token')
    expect(error.statusCode).equal(401)
  })
})
