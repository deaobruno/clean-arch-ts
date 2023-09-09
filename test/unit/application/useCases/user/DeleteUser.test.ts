import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import DeleteUser from '../../../../../src/application/useCases/user/DeleteUser'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import BaseError from '../../../../../src/application/errors/BaseError'
import IRefreshTokenRepository from '../../../../../src/domain/repositories/IRefreshTokenRepository'
import UserRepositoryMock from '../../../../mocks/repositories/inMemory/InMemoryUserRepositoryMock'
import RefreshTokenRepositoryMock from '../../../../mocks/repositories/inMemory/InMemoryRefreshTokenRepositoryMock'

const sandbox = sinon.createSandbox()
const userRepository: IUserRepository = UserRepositoryMock
const refreshTokenRepository: IRefreshTokenRepository = RefreshTokenRepositoryMock
const deleteUser: DeleteUser = new DeleteUser(userRepository, refreshTokenRepository)
const userId = faker.string.uuid()
const email = faker.internet.email()
const password = faker.internet.password()
const fakeUser = {
  userId: faker.string.uuid(),
  email,
  password,
  level: 2,
  isRoot: false,
  isAdmin: false,
  isCustomer: true,
}
let notFoundError: NotFoundError

describe('/application/useCases/user/DeleteUser.ts', () => {
  beforeEach(() => {
    notFoundError = sandbox.stub(NotFoundError.prototype)
    notFoundError.name = 'NotFoundError'
    notFoundError.statusCode = 404
    notFoundError.message = 'User not found'
  })

  afterEach(() => sandbox.restore())

  it('should delete an existing user',async () => {
    sandbox.stub(userRepository, 'findOne')
      .resolves(fakeUser)

    const result = await deleteUser.exec({ userId })

    expect(result).equal(undefined)
  })

  it('should fail when trying to update an user password passing wrong ID', async () => {
    const error = <BaseError>await deleteUser.exec({ userId: '' })

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('User not found')
    expect(error.statusCode).equal(404)
  })
})
