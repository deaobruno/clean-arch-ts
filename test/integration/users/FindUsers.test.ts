import axios from 'axios'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import { LevelEnum } from '../../../src/domain/User'
import config from '../../../src/config'
import InMemoryUserRepository from '../../../src/adapters/repositories/inMemory/InMemoryUserRepository'
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver'
import InMemoryDriver from '../../../src/infra/drivers/db/InMemoryDriver'
import { UserMapper } from '../../../src/domain/mappers/UserMapper'
import { RefreshTokenMapper } from '../../../src/domain/mappers/RefreshTokenMapper'
import InMemoryRefreshTokenRepository from '../../../src/adapters/repositories/inMemory/InMemoryRefreshTokenRepository'
import server from '../../../src/infra/http/v1/server'

const dbDriver = InMemoryDriver.getInstance()
const userMapper = new UserMapper()
const refreshTokenMapper = new RefreshTokenMapper()
const userRepository = new InMemoryUserRepository(config.db.usersSource, dbDriver, userMapper)
const refreshTokenRepository = new InMemoryRefreshTokenRepository(config.db.refreshTokensSource, dbDriver, refreshTokenMapper)
const hashDriver = new CryptoDriver()
const url = 'http://localhost:8080/api/v1/users'
const rootPassword = faker.internet.password()
const usersData: any[] = [
  {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: hashDriver.hashString(faker.internet.password()),
    level: LevelEnum.CUSTOMER,
  },
  {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: hashDriver.hashString(faker.internet.password()),
    level: LevelEnum.CUSTOMER,
  },
  {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: hashDriver.hashString(faker.internet.password()),
    level: LevelEnum.CUSTOMER,
  },
  {
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    password: hashDriver.hashString(rootPassword),
    level: LevelEnum.ROOT,
  },
]
let Authorization: string

describe('GET /users', () => {
  before(async () => {
    usersData.forEach(async userData => await userRepository.save(userData))

    server.start()

    const { data: { accessToken } } = await axios.post('http://localhost:8080/api/v1/auth/login', {
      email: usersData[3].email,
      password: rootPassword,
    })

    Authorization = `Bearer ${ accessToken }`
  })

  after(async () => {
    await userRepository.delete()
    await refreshTokenRepository.delete()

    server.stop()
  })

  it('should get 200 status code and an array with users data when trying to find users without filters', async () => {
    const { status, data } = await axios.get(`${url}`, { headers: { Authorization } })

    expect(status).equal(200)
    expect(data.length).equal(3)
    expect(typeof data[0].id).equal('string')
    expect(data[0].email).equal(usersData[0].email)
    expect(typeof data[1].id).equal('string')
    expect(data[1].email).equal(usersData[1].email)
    expect(typeof data[2].id).equal('string')
    expect(data[2].email).equal(usersData[2].email)
  })

  it('should get 200 status code and an array with users data when trying to find users with filters', async () => {
    const { status, data } = await axios.get(`${url}?email=${usersData[0].email}`, { headers: { Authorization } })

    expect(status).equal(200)
    expect(data.length).equal(1)
    expect(typeof data[0].id).equal('string')
    expect(data[0].email).equal(usersData[0].email)
  })

  it('should get 400 status code when trying to find users passing empty "email" as filter', async () => {
    await axios.get(`${url}?email=`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"email" is required')
    })
  })

  it('should get 400 status code when trying to find users passing invalid "email" as filter', async () => {
    await axios.get(`${url}?email=test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "email" format')
    })
  })

  it('should get 400 status code when trying to find users passing invalid param as filter', async () => {
    await axios.get(`${url}?test=test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal(`Invalid param(s): "test"`)
    })
  })

  it('should get 404 status code when no users are found', async () => {
    await axios.get(`${url}?email=test@test.com`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('Users not found')
    })
  })
})
