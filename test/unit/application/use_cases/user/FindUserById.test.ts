import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import UserRepository from '../../../../../src/adapters/repositories/UserRepository'
import { User } from '../../../../../src/domain/User'
import InMemoryDriver from '../../../../../src/infra/drivers/InMemoryDriver'
import FindUserById from '../../../../../src/application/use_cases/user/FindUserById'
import { expect } from 'chai'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import IRepository from '../../../../../src/domain/repositories/IRepository'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import BaseError from '../../../../../src/application/BaseError'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository<any>
let userRepository: IUserRepository
let findUserById: FindUserById
let notFoundError: NotFoundError
let userId: string
let email: string
let password: string
let fakeUser: User

describe('/application/use_cases/user/FindUserById.ts', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    userRepository = new UserRepository(inMemoryDriver)
    findUserById = new FindUserById(userRepository)
    notFoundError = sandbox.stub(NotFoundError.prototype)
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
    notFoundError.name = 'NotFoundError'
    notFoundError.statusCode = 404
    notFoundError.message = 'User not found'
  })

  afterEach(() => sandbox.restore())

  it('should return an user passing an UUID', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves(fakeUser)

    const user = <User>await findUserById.exec({ userId })

    expect(user.user_id).equal(userId)
    expect(user.email).equal(fakeUser.email)
    expect(user.password).equal(fakeUser.password)
    expect(user.level).equal(fakeUser.level)
    expect(user.isCustomer).equal(true)
    expect(user.isAdmin).equal(false)
    expect(user.isRoot).equal(false)
  })

  it('should return a NotFoundError when no user is found', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves()

    const error = <BaseError>await findUserById.exec({ userId: '' })

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('User not found')
    expect(error.statusCode).equal(404)
  })
})
