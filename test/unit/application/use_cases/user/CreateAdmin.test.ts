import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import CreateAdmin from '../../../../../src/application/use_cases/user/CreateAdmin'
import { LevelEnum, User } from '../../../../../src/domain/User'
import CryptoDriver from '../../../../../src/infra/drivers/CryptoDriver'
import InMemoryDriver from '../../../../../src/infra/drivers/InMemoryDriver'
import UserRepository from '../../../../../src/adapters/repositories/UserRepository'

const inMemoryDriver = new InMemoryDriver()
const cryptoDriver: CryptoDriver = {
  generateID: () => faker.datatype.uuid()
}
const userRepository = new UserRepository(inMemoryDriver)
const user_id = faker.datatype.uuid()
const email = faker.internet.email()
const password = faker.internet.password()
const createAdmin = new CreateAdmin(userRepository, cryptoDriver)

describe('/application/use_cases/user/CreateAdmin.ts', () => {
  it('should successfully create a Admin', async () => {
    const userParams = {
      email,
      password,
      confirm_password: password,
      level: 1
    }

    const user = await createAdmin.exec(userParams)

    expect(typeof user.user_id).equal('string')
    expect(user.email).equal(userParams.email)
    expect(user.password).equal(userParams.password)
    expect(user.level).equal(LevelEnum.ADMIN)
    expect(user.isAdmin).equal(true)
  })

  it('should fail when trying to create a Admin with repeated email', async () => {
    const userParams = {
      email,
      password,
      confirm_password: password,
      level: 1
    }

    userRepository.findOneByEmail = async (email) => {
      return User.create({ user_id, ...userParams })
    }

    await createAdmin.exec(userParams)
      .catch((error) => {
        expect(error.message).equal('Email already in use')
      })
  })
})
