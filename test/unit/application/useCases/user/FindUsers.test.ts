import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { User } from '../../../../../src/domain/User'
import FindUsers from '../../../../../src/application/useCases/user/FindUsers'
import { expect } from 'chai'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import BaseError from '../../../../../src/application/errors/BaseError'
import UserRepositoryMock from '../../../../mocks/repositories/inMemory/InMemoryUserRepositoryMock'

const sandbox = sinon.createSandbox()
const userRepository: IUserRepository = UserRepositoryMock
const findUsers: FindUsers = new FindUsers(userRepository)
const fakeUsers = [
  {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    level: 2,
    isRoot: false,
    isAdmin: false,
    isCustomer: true,
  },
  {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    level: 2,
    isRoot: false,
    isAdmin: false,
    isCustomer: true,
  },
  {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    level: 2,
    isRoot: false,
    isAdmin: false,
    isCustomer: true,
  },
]
let notFoundError: NotFoundError

describe('/application/useCases/user/FindUsers.ts', () => {
  beforeEach(() => {
    notFoundError = sandbox.stub(NotFoundError.prototype)
    notFoundError.name = 'NotFoundError'
    notFoundError.statusCode = 404
    notFoundError.message = 'Users not found'
  })

  afterEach(() => sandbox.restore())

  it('should return an array with all users when no filter is passed', async () => {
    sandbox.stub(userRepository, 'find')
      .resolves(fakeUsers)

    const users = <User[]>await findUsers.exec({})

    expect(users.length).equal(3)
    expect(users[0].userId).equal(fakeUsers[0].userId)
    expect(users[0].email).equal(fakeUsers[0].email)
    expect(users[0].password).equal(fakeUsers[0].password)
    expect(users[0].level).equal(fakeUsers[0].level)
    expect(users[0].isCustomer).equal(true)
    expect(users[0].isAdmin).equal(false)
    expect(users[0].isRoot).equal(false)
    expect(users[1].userId).equal(fakeUsers[1].userId)
    expect(users[1].email).equal(fakeUsers[1].email)
    expect(users[1].password).equal(fakeUsers[1].password)
    expect(users[1].level).equal(fakeUsers[1].level)
    expect(users[1].isCustomer).equal(true)
    expect(users[1].isAdmin).equal(false)
    expect(users[1].isRoot).equal(false)
    expect(users[2].userId).equal(fakeUsers[2].userId)
    expect(users[2].email).equal(fakeUsers[2].email)
    expect(users[2].password).equal(fakeUsers[2].password)
    expect(users[2].level).equal(fakeUsers[2].level)
    expect(users[2].isCustomer).equal(true)
    expect(users[2].isAdmin).equal(false)
    expect(users[2].isRoot).equal(false)
  })

  it('should return an array with filtered users', async () => {
    sandbox.stub(userRepository, 'find')
      .resolves([fakeUsers[0]])

    const users = <User[]>await findUsers.exec({ email: fakeUsers[0].email })

    expect(users.length).equal(1)
    expect(users[0].userId).equal(fakeUsers[0].userId)
    expect(users[0].email).equal(fakeUsers[0].email)
    expect(users[0].password).equal(fakeUsers[0].password)
    expect(users[0].level).equal(fakeUsers[0].level)
    expect(users[0].isCustomer).equal(true)
    expect(users[0].isAdmin).equal(false)
    expect(users[0].isRoot).equal(false)
  })

  it('should return a NotFoundError when no users are found', async () => {
    const error = <BaseError>await findUsers.exec({})

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('Users not found')
    expect(error.statusCode).equal(404)
  })

  it('should return a NotFoundError when no users are found', async () => {
    const error = <BaseError>await findUsers.exec({})

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('Users not found')
    expect(error.statusCode).equal(404)
  })
})
