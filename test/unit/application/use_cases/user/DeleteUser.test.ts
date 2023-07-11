import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import InMemoryDriver from '../../../../../src/infra/drivers/InMemoryDriver'
import UserRepository from '../../../../../src/adapters/repositories/UserRepository'
import { User } from '../../../../../src/domain/User'
import DeleteUser from '../../../../../src/application/use_cases/user/DeleteUser'
import IRepository from '../../../../../src/domain/repositories/IRepository'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import BaseError from '../../../../../src/application/BaseError'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository<any>
let userRepository: IUserRepository
let deleteUser: DeleteUser
let notFoundError: NotFoundError
let userId: string
let email: string
let password: string
let fakeUser: User
let userParams: any

describe('/application/use_cases/user/DeleteUser.ts', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    userRepository = new UserRepository(inMemoryDriver)
    deleteUser = new DeleteUser(userRepository)
    notFoundError = sandbox.stub(NotFoundError.prototype)
    userId = faker.string.uuid()
    email = faker.internet.email()
    password = faker.internet.password()
    fakeUser = {
      user_id: faker.string.uuid(),
      email,
      password,
      level: 2,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    }
    userParams = {
      email,
      password,
      confirm_password: password,
      level: 2,
    }
    notFoundError.name = 'NotFoundError'
    notFoundError.statusCode = 404
    notFoundError.message = 'User not found'
  })

  afterEach(() => sandbox.restore())

  it('should delete an existing user',async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves(fakeUser)
    sandbox.stub(InMemoryDriver.prototype, 'delete')
      .resolves()

    const result = await deleteUser.exec({ userId })

    expect(result).equal(undefined)
  })

  it('should fail when trying to update an user password passing wrong ID', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves()
    sandbox.stub(InMemoryDriver.prototype, 'delete')
      .resolves()

    const error = <BaseError>await deleteUser.exec({ userId: '' })

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('User not found')
    expect(error.statusCode).equal(404)
  })
})
