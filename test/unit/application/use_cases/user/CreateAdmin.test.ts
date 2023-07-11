import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import CreateAdmin from '../../../../../src/application/use_cases/user/CreateAdmin'
import { LevelEnum, User } from '../../../../../src/domain/User'
import CryptoDriver from '../../../../../src/infra/drivers/CryptoDriver'
import InMemoryDriver from '../../../../../src/infra/drivers/InMemoryDriver'
import UserRepository from '../../../../../src/adapters/repositories/UserRepository'
import ConflictError from '../../../../../src/application/errors/ConflictError'
import IRepository from '../../../../../src/domain/repositories/IRepository'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import BaseError from '../../../../../src/application/BaseError'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository<any>
let cryptoDriver: CryptoDriver
let userRepository: IUserRepository
let createAdmin: CreateAdmin
let conflictError: ConflictError
let email: string
let password: string
let fakeUser: User
let userParams: any

describe('/application/use_cases/user/CreateAdmin.ts', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    cryptoDriver = {
      generateID: () => faker.string.uuid(),
      hashString: (text: string) => 'hash',
    }
    userRepository = new UserRepository(inMemoryDriver)
    createAdmin = new CreateAdmin(userRepository, cryptoDriver)
    conflictError = sandbox.stub(ConflictError.prototype)
    email = faker.internet.email()
    password = faker.internet.password()
    fakeUser = {
      user_id: faker.string.uuid(),
      email,
      password,
      level: 1,
      isRoot: false,
      isAdmin: true,
      isCustomer: false,
    }
    userParams = {
      email,
      password,
      confirm_password: password,
      level: 1
    }
    conflictError.name = 'ConflictError'
    conflictError.statusCode = 409
    conflictError.message = 'Email already in use'
  })

  afterEach(() => sandbox.restore())

  it('should successfully create an Admin User', async () => {
    sandbox.stub(UserRepository.prototype, 'findOneByEmail')
      .resolves()
    sandbox.stub(UserRepository.prototype, 'save')
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
    sandbox.stub(UserRepository.prototype, 'findOneByEmail')
      .resolves(fakeUser)
    sandbox.stub(UserRepository.prototype, 'save')
      .resolves()
    sandbox.stub(User, 'create')
      .returns(fakeUser)

    const error = <BaseError>await createAdmin.exec(userParams)

    expect(error instanceof ConflictError).equal(true)
    expect(error.message).equal('Email already in use')
    expect(error.statusCode).equal(409)
  })
})
