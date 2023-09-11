import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import { User } from '../../../../../src/domain/User'
import UpdateUserPassword from '../../../../../src/application/useCases/user/UpdateUserPassword'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import BaseError from '../../../../../src/application/errors/BaseError'
import IRefreshTokenRepository from '../../../../../src/domain/repositories/IRefreshTokenRepository'
import UserRepositoryMock from '../../../../mocks/repositories/inMemory/InMemoryUserRepositoryMock'
import RefreshTokenRepositoryMock from '../../../../mocks/repositories/inMemory/InMemoryRefreshTokenRepositoryMock'
import IHashDriver from '../../../../../src/infra/drivers/hash/IHashDriver'
import HashDriverMock from '../../../../mocks/drivers/HashDriverMock'

const sandbox = sinon.createSandbox()
const cryptoDriver: IHashDriver = HashDriverMock
const userRepository: IUserRepository = UserRepositoryMock
const refreshTokenRepository: IRefreshTokenRepository = RefreshTokenRepositoryMock
const updateUserPassword: UpdateUserPassword = new UpdateUserPassword(cryptoDriver, userRepository, refreshTokenRepository)
const userId = faker.string.uuid()
const email = faker.internet.email()
const password = faker.internet.password()
const fakeUser = {
  userId,
  email,
  password,
  level: 2,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
}
let notFoundError: NotFoundError

describe('/application/useCases/user/UpdateUserPassword.ts', () => {
  beforeEach(() => {
    notFoundError = sandbox.stub(NotFoundError.prototype)
    notFoundError.name = 'NotFoundError'
    notFoundError.statusCode = 404
    notFoundError.message = 'User not found'
  })

  afterEach(() => sandbox.restore())

  it('should update the password of an existing user', async () => {
    sandbox.stub(userRepository, 'findOne')
      .resolves(fakeUser)

    const newPassword = faker.internet.password()

    fakeUser.password = cryptoDriver.hashString(newPassword)

    sandbox.stub(userRepository, 'save')
      .resolves(fakeUser)

    const updateData = {
      user_id: userId,
      password: newPassword,
      confirm_password: newPassword,
    }

    const user = <User>await updateUserPassword.exec(updateData)

    expect(user.userId).equal(fakeUser.userId)
    expect(user.email).equal(fakeUser.email)
    expect(user.password).equal(fakeUser.password)
    expect(user.level).equal(fakeUser.level)
    expect(user.isCustomer).equal(true)
    expect(user.isAdmin).equal(false)
    expect(user.isRoot).equal(false)
  })

  it('should fail when trying to update an user password passing wrong ID', async () => {
    const error = <BaseError>await updateUserPassword.exec({ user_id: '', password: '' })

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('User not found')
    expect(error.statusCode).equal(404)
  })
})
