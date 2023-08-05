import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { User } from '../../../../../src/domain/User'
import FindUserById from '../../../../../src/application/use_cases/user/FindUserById'
import { expect } from 'chai'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import BaseError from '../../../../../src/application/errors/BaseError'
import UserRepositoryMock from '../../../../mocks/repositories/UserRepositoryMock'

const sandbox = sinon.createSandbox()
const userRepository: IUserRepository = UserRepositoryMock
const findUserById: FindUserById = new FindUserById(userRepository)
const userId = faker.string.uuid()
const email = faker.internet.email()
const password = faker.internet.password()
const fakeUser = {
  user_id: userId,
  email,
  password,
  level: 2,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
}
let notFoundError: NotFoundError

describe('/application/use_cases/user/FindUserById.ts', () => {
  beforeEach(() => {
    notFoundError = sandbox.stub(NotFoundError.prototype)
    notFoundError.name = 'NotFoundError'
    notFoundError.statusCode = 404
    notFoundError.message = 'User not found'
  })

  afterEach(() => sandbox.restore())

  it('should return an user passing an UUID', async () => {
    sandbox.stub(userRepository, 'findOne')
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
    const error = <BaseError>await findUserById.exec({ userId: '' })

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('User not found')
    expect(error.statusCode).equal(404)
  })
})
