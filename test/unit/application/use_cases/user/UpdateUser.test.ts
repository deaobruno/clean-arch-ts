import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import InMemoryDriver from '../../../../../src/infra/drivers/InMemoryDriver'
import UserRepository from '../../../../../src/adapters/repositories/UserRepository'
import { User } from '../../../../../src/domain/User'
import UpdateUser from '../../../../../src/application/use_cases/user/UpdateUser'
import IRepository from '../../../../../src/domain/repositories/IRepository'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import BaseError from '../../../../../src/application/BaseError'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository<any>
let userRepository: IUserRepository
let updateUser: UpdateUser
let notFoundError: NotFoundError
let fakeUser: User
let userId = faker.string.uuid()
let email: string
let password: string

describe('/application/use_cases/user/UpdateUser.ts', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    userRepository = new UserRepository(inMemoryDriver)
    updateUser = new UpdateUser(userRepository)
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

  it('should update an existing user', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves(fakeUser)

    const newEmail = faker.internet.email()

    fakeUser.email = newEmail

    sandbox.stub(UserRepository.prototype, 'save')
      .resolves(fakeUser)

    const updateData = {
      userId,
      email: newEmail,
    }
    const user = <User>await updateUser.exec(updateData)

    expect(user.user_id).equal(fakeUser.user_id)
    expect(user.email).equal(newEmail)
    expect(user.password).equal(fakeUser.password)
    expect(user.level).equal(fakeUser.level)
    expect(user.isCustomer).equal(true)
    expect(user.isAdmin).equal(false)
    expect(user.isRoot).equal(false)
  })

  it('should fail when trying to update an user passing wrong ID', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves()

    const error = <BaseError>await updateUser.exec({ userId: '' })

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('User not found')
    expect(error.statusCode).equal(404)
  })
})
