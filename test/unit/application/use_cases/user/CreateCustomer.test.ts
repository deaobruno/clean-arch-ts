import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import CreateCustomer from '../../../../../src/application/use_cases/user/CreateCustomer'
import { LevelEnum, User } from '../../../../../src/domain/User'
import IUserRepository from '../../../../../src/domain/repositories/IUserRepository'
import CryptoDriver from '../../../../../src/infra/drivers/CryptoDriver'

const userRepository: IUserRepository = {
  async save(data: any, filters?: object): Promise<User> {
    return data
  },
  async find(filters?: any): Promise<User[]> {
    return []
  },
  async findCustomers(): Promise<User[]> {
    return []
  },
  async findAdmins(): Promise<User[]> {
    return []
  },
  async findOne(filters: any): Promise<User | undefined> {
    return
  },
  async findOneByEmail(email: string): Promise<User | undefined> {
    return
  },
  async delete(filters: any): Promise<void> {
    return
  },
}

const cryptoDriver: CryptoDriver = {
  generateID: () => faker.datatype.uuid()
}

const user_id = faker.datatype.uuid()
const email = faker.internet.email()
const password = '$Baw@Y;nH5dUq!HRBkGctpiFLYM=73icS^_?e#dTWmM[?g]:1aV#X&w]bXp:KC+h'

describe('/application/CreateCustomer.ts', () => {
  const createCustomerUseCase = new CreateCustomer(userRepository, cryptoDriver)

  it('should successfully create a Customer', async () => {
    const userParams = {
      email,
      password,
      confirm_password: password,
      level: 2
    }

    const user = await createCustomerUseCase.exec(userParams)

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

    await createCustomerUseCase.exec(userParams)
      .catch((error) => {
        expect(error.message).equal('Email already in use')
      })
  })
})
