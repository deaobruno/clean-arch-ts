import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import InMemoryUserRepository from '../../../../src/adapters/repositories/inMemory/InMemoryUserRepository'
import InMemoryDriver from '../../../../src/infra/drivers/InMemoryDriver'
import { User } from '../../../../src/domain/User'

const inMemoryDriver = new InMemoryDriver()

const userRepository = new InMemoryUserRepository(inMemoryDriver)

describe('/adapters/repositories/InMemoryUserRepository', () => {
  afterEach(async () => {
    const users = await userRepository.find()

    users.forEach(async user => {
      const { user_id } = user

      await userRepository.delete({ user_id })
    })
  })

  it('should return an array of admin Users', async () => {
    for (let i = 0; i < 3; i++)
      await userRepository.save(User.create({
        user_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: 'test',
        level: 1
      }))

    const admins = await userRepository.findAdmins()

    expect(admins[0]).property('user_id')
    expect(admins[0]).property('email')
    expect(admins[0]).property('password')
    expect(admins[0].level).equal(1)
    expect(admins[1]).property('user_id')
    expect(admins[1]).property('email')
    expect(admins[1]).property('password')
    expect(admins[1].level).equal(1)
    expect(admins[2]).property('user_id')
    expect(admins[2]).property('email')
    expect(admins[2]).property('password')
    expect(admins[2].level).equal(1)
  })

  it('should return an empty array of admin Users', async () => {
    const admins = await userRepository.findAdmins()

    expect(admins).length(0)
  })

  it('should return an array of customer Users', async () => {
    for (let i = 0; i < 3; i++)
      await userRepository.save(User.create({
        user_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: 'test',
        level: 2
      }))

    const customers = await userRepository.findCustomers()

    expect(customers[0]).property('user_id')
    expect(customers[0]).property('email')
    expect(customers[0]).property('password')
    expect(customers[0].level).equal(2)
    expect(customers[1]).property('user_id')
    expect(customers[1]).property('email')
    expect(customers[1]).property('password')
    expect(customers[1].level).equal(2)
    expect(customers[2]).property('user_id')
    expect(customers[2]).property('email')
    expect(customers[2]).property('password')
    expect(customers[2].level).equal(2)
  })

  it('should return an empty array of customer Users', async () => {
    const customers = await userRepository.findCustomers()

    expect(customers).length(0)
  })

  it('should return an User passing the email as a filter', async () => {
    await userRepository.save(User.create({
      user_id: faker.datatype.uuid(),
      email: 'test@email.com',
      password: 'test',
      level: 2
    }))

    const email = 'test@email.com'
    const user = await userRepository.findOneByEmail(email)

    expect(user).property('user_id')
    expect(user?.email).equal(email)
    expect(user).property('password')
    expect(user).property('level')
  })

  it('should not return an User passing an invalid email as a filter', async () => {
    const user = await userRepository.findOneByEmail('')

    expect(user).equal(undefined)
  })
})
