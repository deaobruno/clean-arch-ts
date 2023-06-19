import { faker } from '@faker-js/faker'
import UserRepository from "../../../../../src/adapters/repositories/UserRepository"
import { User } from "../../../../../src/domain/User"
import InMemoryDriver from "../../../../../src/infra/drivers/InMemoryDriver"
import FindUserById from '../../../../../src/application/use_cases/user/FindUserById'
import { expect } from 'chai'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'

const inMemoryDriver = new InMemoryDriver()
const userRepository = new UserRepository(inMemoryDriver)

describe('/application/FindUserById.ts', () => {
  const findUsersById = new FindUserById(userRepository)

  afterEach(async () => {
    const users = await userRepository.find()

    users.forEach(async user => {
      const { user_id } = user

      await userRepository.delete({ user_id })
    })
  })

  it('should return an user passing an UUID', async () => {
    const userId = faker.datatype.uuid()
    const userParams = {
      user_id: userId,
      email: faker.internet.email(),
      password: 'test',
      level: 2
    }

    await userRepository.save(User.create(userParams))

    const user = await findUsersById.exec({ userId })

    expect(user.user_id).equal(userId)
    expect(user.email).equal(userParams.email)
    expect(user.password).equal(userParams.password)
    expect(user.level).equal(userParams.level)
  })

  it('should return a NotFoundError when no user is found', async () => {
    await findUsersById.exec({ userId: '' })
      .catch(error => {
        expect(error instanceof NotFoundError).equal(true)
        expect(error.message).equal('User not found')
      })
  })
})
