import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import UserRepository from '../../../../src/adapters/repositories/UserRepository'
import InMemoryDriver from '../../../../src/infra/drivers/InMemoryDriver'
import { User } from '../../../../src/domain/User'
import IRepository from '../../../../src/domain/repositories/IRepository'
import IUserRepository from '../../../../src/domain/repositories/IUserRepository'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository<any>
let userRepository: IUserRepository
let fakeUsers: User[]

describe('/adapters/repositories/UserRepository', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    userRepository = new UserRepository(inMemoryDriver)
  })

  afterEach(() => sandbox.restore())

  it('should save an User entity', async () => {
    const fakeUser = {
      user_id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: 2,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    }

    sandbox.stub(InMemoryDriver.prototype, 'save')
      .resolves(fakeUser)

    const user = await userRepository.save(fakeUser)

    expect(user.user_id).equal(fakeUser.user_id)
    expect(user.email).equal(fakeUser.email)
    expect(user.password).equal(fakeUser.password)
    expect(user.level).equal(fakeUser.level)
    expect(user.isCustomer).equal(fakeUser.isCustomer)
    expect(user.isAdmin).equal(fakeUser.isAdmin)
    expect(user.isRoot).equal(fakeUser.isRoot)
  })

  it('should return an array of admin Users', async () => {
    fakeUsers = [
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 1,
        isRoot: false,
        isAdmin: true,
        isCustomer: false,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 1,
        isRoot: false,
        isAdmin: true,
        isCustomer: false,
      },
      {
        user_id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 1,
        isRoot: false,
        isAdmin: true,
        isCustomer: false,
      },
    ]

    sandbox.stub(InMemoryDriver.prototype, 'find')
      .resolves(fakeUsers)

    const admins = await userRepository.findAdmins()

    expect(admins.length).equal(3)
    expect(admins[0].user_id).equal(fakeUsers[0].user_id)
    expect(admins[0].email).equal(fakeUsers[0].email)
    expect(admins[0].password).equal(fakeUsers[0].password)
    expect(admins[0].level).equal(1)
    expect(admins[0].isCustomer).equal(false)
    expect(admins[0].isAdmin).equal(true)
    expect(admins[0].isRoot).equal(false)
    expect(admins[1].user_id).equal(fakeUsers[1].user_id)
    expect(admins[1].email).equal(fakeUsers[1].email)
    expect(admins[1].password).equal(fakeUsers[1].password)
    expect(admins[1].level).equal(1)
    expect(admins[1].isCustomer).equal(false)
    expect(admins[1].isAdmin).equal(true)
    expect(admins[1].isRoot).equal(false)
    expect(admins[2].user_id).equal(fakeUsers[2].user_id)
    expect(admins[2].email).equal(fakeUsers[2].email)
    expect(admins[2].password).equal(fakeUsers[2].password)
    expect(admins[2].level).equal(1)
    expect(admins[2].isCustomer).equal(false)
    expect(admins[2].isAdmin).equal(true)
    expect(admins[2].isRoot).equal(false)
  })

  it('should return an empty array of admin Users', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'find')
      .resolves([])

    const admins = await userRepository.findAdmins()

    expect(admins).length(0)
  })

  it('should return an array of customer Users', async () => {
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

    sandbox.stub(InMemoryDriver.prototype, 'find')
      .resolves(fakeUsers)

    const customers = await userRepository.findCustomers()

    expect(customers.length).equal(3)
    expect(customers[0].user_id).equal(fakeUsers[0].user_id)
    expect(customers[0].email).equal(fakeUsers[0].email)
    expect(customers[0].password).equal(fakeUsers[0].password)
    expect(customers[0].level).equal(2)
    expect(customers[0].isCustomer).equal(true)
    expect(customers[0].isAdmin).equal(false)
    expect(customers[0].isRoot).equal(false)
    expect(customers[1].user_id).equal(fakeUsers[1].user_id)
    expect(customers[1].email).equal(fakeUsers[1].email)
    expect(customers[1].password).equal(fakeUsers[1].password)
    expect(customers[1].level).equal(2)
    expect(customers[1].isCustomer).equal(true)
    expect(customers[1].isAdmin).equal(false)
    expect(customers[1].isRoot).equal(false)
    expect(customers[2].user_id).equal(fakeUsers[2].user_id)
    expect(customers[2].email).equal(fakeUsers[2].email)
    expect(customers[2].password).equal(fakeUsers[2].password)
    expect(customers[2].level).equal(2)
    expect(customers[2].isCustomer).equal(true)
    expect(customers[2].isAdmin).equal(false)
    expect(customers[2].isRoot).equal(false)
  })

  it('should return an empty array of customer Users', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'find')
      .resolves([])

    const customers = await userRepository.findCustomers()

    expect(customers).length(0)
  })

  it('should return an User passing the email as a filter', async () => {
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
    ]

    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves(fakeUsers[0])

    const user = <any>await userRepository.findOneByEmail(fakeUsers[0].email)

    expect(user.user_id).equal(fakeUsers[0].user_id)
    expect(user.email).equal(fakeUsers[0].email)
    expect(user.password).equal(fakeUsers[0].password)
    expect(user.level).equal(fakeUsers[0].level)
    expect(user.isCustomer).equal(true)
    expect(user.isAdmin).equal(false)
    expect(user.isRoot).equal(false)
  })

  it('should not return an User passing an invalid email as a filter', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves()

    const user = await userRepository.findOneByEmail('')

    expect(user).equal(undefined)
  })
})
