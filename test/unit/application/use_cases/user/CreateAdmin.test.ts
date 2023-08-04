import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import CreateAdmin from '../../../../../src/application/use_cases/user/CreateAdmin'
import { LevelEnum, User } from '../../../../../src/domain/User'
import ConflictError from '../../../../../src/application/errors/ConflictError'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import BaseError from '../../../../../src/application/BaseError'
import IHashDriver from '../../../../../src/infra/drivers/hash/IHashDriver'
import HashDriverMock from '../../../../mocks/drivers/HashDriverMock'
import UserRepositoryMock from '../../../../mocks/repositories/UserRepositoryMock'

const sandbox = sinon.createSandbox()
const cryptoDriver: IHashDriver = HashDriverMock
const userRepository: IUserRepository = UserRepositoryMock
const createAdmin = new CreateAdmin(userRepository, cryptoDriver)
const email = faker.internet.email()
const password = faker.internet.password()
const fakeUser = {
  user_id: faker.string.uuid(),
  email,
  password,
  level: 1,
  isRoot: false,
  isAdmin: true,
  isCustomer: false,
}
let userParams = {
  email,
  password,
  confirm_password: password,
  level: 1
}
let conflictError: ConflictError

describe('/application/use_cases/user/CreateAdmin.ts', () => {
  beforeEach(() => {
    conflictError = sandbox.stub(ConflictError.prototype)
    conflictError.name = 'ConflictError'
    conflictError.statusCode = 409
    conflictError.message = 'Email already in use'
  })

  afterEach(() => sandbox.restore())

  it('should successfully create an Admin User', async () => {
    sandbox.stub(userRepository, 'save')
      .resolves(fakeUser)
    sandbox.stub(User, 'create')
      .returns(fakeUser)

    const user = <User>await createAdmin.exec(userParams)

    expect(user.user_id).equal(fakeUser.user_id)
    expect(user.email).equal(userParams.email)
    expect(user.password).equal(userParams.password)
    expect(user.level).equal(LevelEnum.ADMIN)
    expect(user.isCustomer).equal(false)
    expect(user.isAdmin).equal(true)
    expect(user.isRoot).equal(false)
  })

  it('should fail when trying to create an Admin User with repeated email', async () => {
    sandbox.stub(userRepository, 'findOneByEmail')
      .resolves(fakeUser)
    sandbox.stub(userRepository, 'save')
      .resolves()
    sandbox.stub(User, 'create')
      .returns(fakeUser)

    const error = <BaseError>await createAdmin.exec(userParams)

    expect(error instanceof ConflictError).equal(true)
    expect(error.message).equal('Email already in use')
    expect(error.statusCode).equal(409)
  })
})
