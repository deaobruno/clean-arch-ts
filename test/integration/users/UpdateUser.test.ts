import axios from 'axios'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import { LevelEnum } from '../../../src/domain/User'
import routes from '../../../src/infra/http/v1/routes'
import config from '../../../src/config'
import dependencies from '../../../src/dependencies'
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver'
import InMemoryUserRepository from '../../../src/adapters/repositories/inMemory/InMemoryUserRepository'
import InMemoryDriver from '../../../src/infra/drivers/db/InMemoryDriver'
import { UserMapper } from '../../../src/domain/mappers/UserMapper'
import { RefreshTokenMapper } from '../../../src/domain/mappers/RefreshTokenMapper'
import InMemoryRefreshTokenRepository from '../../../src/adapters/repositories/inMemory/InMemoryRefreshTokenRepository'

const dependenciesContainer = dependencies(config)
const {
  drivers: {
    httpServerDriver,
  },
} = dependenciesContainer
const dbDriver = InMemoryDriver.getInstance()
const userMapper = new UserMapper()
const refreshTokenMapper = new RefreshTokenMapper()
const userRepository = new InMemoryUserRepository(config.db.usersSource, dbDriver, userMapper)
const refreshTokenRepository = new InMemoryRefreshTokenRepository(config.db.refreshTokensSource, dbDriver, refreshTokenMapper)
const hashDriver = new CryptoDriver()
const url = 'http://localhost:3031/api/v1/users'
let userId: string
let email: string
let Authorization: string

describe('PUT /users/:user_id', () => {
  before(() => httpServerDriver.start(3031, routes(dependenciesContainer)))

  beforeEach(async () => {
    const password = faker.internet.password()

    userId = faker.string.uuid()
    email = faker.internet.email()

    await userRepository.save({
      userId,
      email,
      password: hashDriver.hashString(password),
      level: LevelEnum.CUSTOMER,
    })

    const { data: { accessToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', {
      email,
      password,
    })

    Authorization = `Bearer ${ accessToken }`
  })

  after(async () => {
    await userRepository.delete()
    await refreshTokenRepository.delete()

    httpServerDriver.stop()
  })

  it('should get 200 when trying to update an existing user', async () => {
    const newEmail = faker.internet.email()
    const payload = {
      email: newEmail
    }
    const { status, data } = await axios.put(`${ url }/${userId}`, payload, { headers: { Authorization } })

    expect(status).equal(200)
    expect(data.id).equal(userId)
    expect(data.email).equal(newEmail)
  })

  it('should get 400 status code when trying to update an user passing invalid id', async () => {
    const payload = {
      email: faker.internet.email()
    }

    await axios.put(`${ url }/test`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "user_id" format')
    })
  })

  it('should get 400 status code when trying to update an user passing empty "email" as param', async () => {
    const payload = {
      email: ''
    }

    await axios.put(`${ url }/${faker.string.uuid()}`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"email" is required')
    })
  })

  it('should get 400 status code when trying to update an user passing invalid "email" as param', async () => {
    const payload = {
      email: 'test'
    }

    await axios.put(`${ url }/${faker.string.uuid()}`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "email" format')
    })
  })

  it('should get 400 status code when trying to update an user with invalid param', async () => {
    const payload = {
      email: 'admin@email.com',
      test: 'test'
    }

    await axios.put(`${ url }/${faker.string.uuid()}`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal(`Invalid param(s): "test"`)
    })
  })

  it('should get 404 status code when user is not found', async () => {
    const payload = {}

    await axios.put(`${ url }/${faker.string.uuid()}`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })

  it('should get 404 status code when authenticated customer is different from token user', async () => {
    const userId = faker.string.uuid()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await userRepository.save({
      userId,
      email,
      password: hashDriver.hashString(password),
      level: LevelEnum.ROOT,
    })

    const { data: { accessToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', {
      email,
      password,
    })

    Authorization = `Bearer ${ accessToken }`

    const payload = {}

    await axios.put(`${ url }/${ userId }`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
