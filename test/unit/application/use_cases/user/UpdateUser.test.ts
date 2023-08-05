import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import { User } from '../../../../../src/domain/User'
import UpdateUser from '../../../../../src/application/use_cases/user/UpdateUser'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import BaseError from '../../../../../src/application/errors/BaseError'
import IRefreshTokenRepository from '../../../../../src/domain/repositories/IRefreshTokenRepository'
import UserRepositoryMock from '../../../../mocks/repositories/UserRepositoryMock'
import RefreshTokenRepositoryMock from '../../../../mocks/repositories/RefreshTokenRepositoryMock'

const sandbox = sinon.createSandbox()
const userRepository: IUserRepository = UserRepositoryMock
const refreshTokenRepository: IRefreshTokenRepository = RefreshTokenRepositoryMock
const updateUser: UpdateUser = new UpdateUser(userRepository, refreshTokenRepository)
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

describe('/application/use_cases/user/UpdateUser.ts', () => {
  beforeEach(() => {
    notFoundError = sandbox.stub(NotFoundError.prototype)
    notFoundError.name = 'NotFoundError'
    notFoundError.statusCode = 404
    notFoundError.message = 'User not found'
  })

  afterEach(() => sandbox.restore())

  it('should update an existing user', async () => {
    sandbox.stub(userRepository, 'findOne')
      .resolves(fakeUser)

    const newEmail = faker.internet.email()

    fakeUser.email = newEmail

    sandbox.stub(userRepository, 'save')
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
    const error = <BaseError>await updateUser.exec({ userId: '' })

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('User not found')
    expect(error.statusCode).equal(404)
  })
})
