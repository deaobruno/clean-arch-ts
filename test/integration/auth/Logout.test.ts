import axios from 'axios'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import routes from '../../../src/infra/http/v1/routes'
import dependencies from '../../../src/dependencies'
import config from '../../../src/config'
import InMemoryUserRepository from '../../../src/adapters/repositories/inMemory/InMemoryUserRepository'
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver'
import { LevelEnum } from '../../../src/domain/User'
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
const hashDriver = new CryptoDriver()
const dbDriver = InMemoryDriver.getInstance()
const userMapper = new UserMapper()
const refreshTokenMapper = new RefreshTokenMapper()
const userRepository = new InMemoryUserRepository(config.db.usersSource, dbDriver, userMapper)
const refreshTokenRepository = new InMemoryRefreshTokenRepository(config.db.refreshTokensSource, dbDriver, refreshTokenMapper)
const url = 'http://localhost:3031/api/v1/auth/logout'
const email = faker.internet.email()
const password = faker.internet.password()
let Authorization: string
let token: string

describe('DELETE /auth/logout', () => {
  before(async () => {
    await userRepository.save({
      userId: faker.string.uuid(),
      email,
      password: hashDriver.hashString(password),
      level: LevelEnum.CUSTOMER,
    })

    httpServerDriver.start(3031, routes(dependenciesContainer))
  })

  beforeEach(async () => {
    const { data: { accessToken, refreshToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', {
      email,
      password,
    })

    Authorization = `Bearer ${ accessToken }`
    token = refreshToken
  })

  after(async () => {
    await userRepository.delete()
    await refreshTokenRepository.delete()

    httpServerDriver.stop()
  })

  it('should get 204 status code when successfully log an user out', async () => {
    const { status } = await axios.delete(url, { headers: { Authorization }, data: { refresh_token: token } })

    expect(status).equal(204)
  })

  it('should get 404 status code when refreshToken is not found', async () => {
    await axios.delete(url, { headers: { Authorization }, data: { refresh_token: 'token' } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('Refresh token not found')
      })
  })

  it('should get 403 status code when authenticated user is different from token user', async () => {
    const newEmail = faker.internet.email()

    await userRepository.save({
      userId: faker.string.uuid(),
      email: newEmail,
      password: hashDriver.hashString(password),
      level: LevelEnum.ADMIN
    })

    const { data: { refreshToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', {
      email: newEmail,
      password,
    })

    await axios.delete(url, { headers: { Authorization }, data: { refresh_token: refreshToken } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(403)
        expect(data.error).equal('Token does not belong to user')
    })
  })
})
