import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import CreateCustomer from '../../../src/application/user/CreateCustomer'
import { User } from '../../../src/domain/User'
import UserRepository from '../../../src/domain/repositories/UserRepository'

const userRepository: UserRepository = {
  async save(data: any): Promise<User> {
    return data
  },
  async find(params?: any): Promise<User[]> {
    return []
  },
  async findCustomers(): Promise<User[]> {
    return []
  },
  async findAdmins(): Promise<User[]> {
    return []
  },
  async findOne(params: any): Promise<User | undefined> {
    return
  },
  async findOneById(id: string): Promise<User | undefined> {
    return
  },
  async findOneByEmail(email: string): Promise<User | undefined> {
    return
  },
  async exists(): Promise<boolean> {
    return false
  },
  async delete(id: string): Promise<void> {
    return
  },
  async deleteMany(filters?: any): Promise<void> {
    return
  },
}

const email = faker.internet.email()
const password = '$Baw@Y;nH5dUq!HRBkGctpiFLYM=73icS^_?e#dTWmM[?g]:1aV#X&w]bXp:KC+h'

describe('/application/CreateCustomer.ts', () => {
  const createCustomerUseCase = new CreateCustomer(userRepository)

  it('should successfully create an User', async () => {
    const userParams = {
      email,
      password,
      confirm_password: password,
      level: 0
    }

    await createCustomerUseCase.exec(userParams)
  })

  it('should fail when trying to create an User with repeated email', async () => {
    const userParams = {
      email: email,
      password,
      confirm_password: password,
      level: 0
    }

    userRepository.findOneByEmail = async (email) => {
      return User.create(userParams)
    }

    await createCustomerUseCase.exec(userParams)
      .catch((error) => {
        expect(error.message).equal('Email already in use')
      })
  })

  it('should fail when trying to create an User with mismatching passwords', async () => {
    const userParams = {
      email,
      password,
      confirm_password: 'password',
      level: 0
    }

    await createCustomerUseCase.exec(userParams)
      .catch((error) => {
        expect(error.message).equal('Passwords mismatching')
      })
  })
})
