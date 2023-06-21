import { faker } from '@faker-js/faker'
import UserRepository from "../../../../../src/adapters/repositories/UserRepository"
import { User } from "../../../../../src/domain/User"
import InMemoryDriver from "../../../../../src/infra/drivers/InMemoryDriver"
import { FindUsers } from '../../../../../src/application/use_cases/user/FindUsers'
import { expect } from 'chai'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'

const inMemoryDriver = new InMemoryDriver()
const userRepository = new UserRepository(inMemoryDriver)
const findUsers = new FindUsers(userRepository)

describe('/application/use_cases/user/FindUsers.ts', () => {
  afterEach(async () => {
    const users = await userRepository.find()

    users.forEach(async user => {
      const { user_id } = user

      await userRepository.delete({ user_id })
    })
  })

  it('should return an array of users', async () => {
    for (let i = 0; i < 3; i++)
      await userRepository.save(User.create({
        user_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: 'test',
        level: 2
      }))

    const users = await findUsers.exec()

    expect(users[0]).property('user_id')
    expect(users[0]).property('email')
    expect(users[0]).property('password')
    expect(users[0].level).equal(2)
    expect(users[1]).property('user_id')
    expect(users[1]).property('email')
    expect(users[1]).property('password')
    expect(users[1].level).equal(2)
    expect(users[2]).property('user_id')
    expect(users[2]).property('email')
    expect(users[2]).property('password')
    expect(users[2].level).equal(2)
  })

  it('should return a NotFoundError when no users are found', async () => {
    await findUsers.exec()
      .catch(error => {
        expect(error instanceof NotFoundError).equal(true)
        expect(error.message).equal('Users not found')
      })
  })
})
