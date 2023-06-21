import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import { Register } from '../../../../../src/application/use_cases/auth/Register'
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
const register = new Register(userRepository, cryptoDriver)

describe('/application/use_cases/auth/Register.ts', () => {
  it('should successfully create a Customer', async () => {
    const userParams = {
      email,
      password,
      confirm_password: password,
      level: 2
    }

    const user = await register.exec(userParams)

    expect(typeof user.user_id).equal('string')
    expect(user.email).equal(userParams.email)
    expect(user.password).equal(userParams.password)
    expect(user.level).equal(LevelEnum.CUSTOMER)
    expect(user.isCustomer).equal(true)
  })

  it('should fail when trying to create a Customer with repeated email', async () => {
    const userParams = {
      email,
      password,
      confirm_password: password,
      level: 2
    }

    userRepository.findOneByEmail = async (email) => {
      return User.create({ user_id, ...userParams })
    }

    await register.exec(userParams)
      .catch((error) => {
        expect(error.message).equal('Email already in use')
      })
  })
})
