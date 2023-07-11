import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import UserRepository from '../../../../../src/adapters/repositories/UserRepository'
import { User } from '../../../../../src/domain/User'
import InMemoryDriver from '../../../../../src/infra/drivers/InMemoryDriver'
import FindUsers from '../../../../../src/application/use_cases/user/FindUsers'
import { expect } from 'chai'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import IRepository from '../../../../../src/domain/repositories/IRepository'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import BaseError from '../../../../../src/application/BaseError'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository<any>
let userRepository: IUserRepository
let findUsers: FindUsers
let notFoundError: NotFoundError
let fakeUsers: User[]

describe('/application/use_cases/user/FindUsers.ts', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    userRepository = new UserRepository(inMemoryDriver)
    findUsers = new FindUsers(userRepository)
    notFoundError = sandbox.stub(NotFoundError.prototype)
    fakeUsers = [
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2,
        isRoot: false,
        isAdmin: false,
        isCustomer: true,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2,
        isRoot: false,
        isAdmin: false,
        isCustomer: true,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2,
        isRoot: false,
        isAdmin: false,
        isCustomer: true,
      },
    ]
    notFoundError.name = 'NotFoundError'
    notFoundError.statusCode = 404
    notFoundError.message = 'Users not found'
  })

  afterEach(() => sandbox.restore())

  it('should return an array with all users when no filter is passed', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'find')
      .resolves(fakeUsers)

    const users = <User[]>await findUsers.exec({})

    expect(users.length).equal(3)
    expect(users[0].user_id).equal(fakeUsers[0].user_id)
    expect(users[0].email).equal(fakeUsers[0].email)
    expect(users[0].password).equal(fakeUsers[0].password)
    expect(users[0].level).equal(fakeUsers[0].level)
    expect(users[0].isCustomer).equal(true)
    expect(users[0].isAdmin).equal(false)
    expect(users[0].isRoot).equal(false)
    expect(users[1].user_id).equal(fakeUsers[1].user_id)
    expect(users[1].email).equal(fakeUsers[1].email)
    expect(users[1].password).equal(fakeUsers[1].password)
    expect(users[1].level).equal(fakeUsers[1].level)
    expect(users[1].isCustomer).equal(true)
    expect(users[1].isAdmin).equal(false)
    expect(users[1].isRoot).equal(false)
    expect(users[2].user_id).equal(fakeUsers[2].user_id)
    expect(users[2].email).equal(fakeUsers[2].email)
    expect(users[2].password).equal(fakeUsers[2].password)
    expect(users[2].level).equal(fakeUsers[2].level)
    expect(users[2].isCustomer).equal(true)
    expect(users[2].isAdmin).equal(false)
    expect(users[2].isRoot).equal(false)
  })

  it('should return an array with filtered users', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'find')
      .resolves([fakeUsers[0]])

    const users = <User[]>await findUsers.exec({ email: fakeUsers[0].email })

    expect(users.length).equal(1)
    expect(users[0].user_id).equal(fakeUsers[0].user_id)
    expect(users[0].email).equal(fakeUsers[0].email)
    expect(users[0].password).equal(fakeUsers[0].password)
    expect(users[0].level).equal(fakeUsers[0].level)
    expect(users[0].isCustomer).equal(true)
    expect(users[0].isAdmin).equal(false)
    expect(users[0].isRoot).equal(false)
  })

  it('should return a NotFoundError when no users are found', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'find')
      .resolves()

    const error = <BaseError>await findUsers.exec({})

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('Users not found')
    expect(error.statusCode).equal(404)
  })

  it('should return a NotFoundError when no users are found', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'find')
      .resolves([])

    const error = <BaseError>await findUsers.exec({})

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('Users not found')
    expect(error.statusCode).equal(404)
  })
})
