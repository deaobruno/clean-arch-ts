import axios from 'axios'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver'
import { LevelEnum } from '../../../src/domain/User'
import httpRoutes from '../../../src/infra/http/v1/routes'
import config from '../../../src/config'
import dependencies from '../../../src/dependencies'
import InMemoryUserRepository from '../../../src/adapters/repositories/inMemory/InMemoryUserRepository'
import CryptoDriver from '../../../src/infra/drivers/hash/CryptoDriver'
import InMemoryDriver from '../../../src/infra/drivers/db/InMemoryDriver'
import { UserMapper } from '../../../src/domain/mappers/UserMapper'
import { RefreshTokenMapper } from '../../../src/domain/mappers/RefreshTokenMapper'
import InMemoryRefreshTokenRepository from '../../../src/adapters/repositories/inMemory/InMemoryRefreshTokenRepository'

const routes = httpRoutes(dependencies(config))
const server = new ExpressDriver(3031)
const dbDriver = InMemoryDriver.getInstance()
const userMapper = new UserMapper()
const refreshTokenMapper = new RefreshTokenMapper()
const userRepository = new InMemoryUserRepository(config.db.usersSource, dbDriver, userMapper)
const refreshTokenRepository = new InMemoryRefreshTokenRepository(config.db.refreshTokensSource, dbDriver, refreshTokenMapper)
const hashDriver = new CryptoDriver()
const url = 'http://localhost:3031/api/v1/users'
const userId = faker.string.uuid()
const email = faker.internet.email()
const password = faker.internet.password()
let Authorization: string

describe('GET /users/:user_id', () => {
  before(async () => {
    await userRepository.save({
      userId,
      email,
      password: hashDriver.hashString(password),
      level: LevelEnum.CUSTOMER,
    })

    server.start(routes, '/api/v1')

    const { data: { accessToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', {
      email,
      password,
    })

    Authorization = `Bearer ${ accessToken }`
  })

  after(async () => {
    await userRepository.delete()
    await refreshTokenRepository.delete()

    server.stop()
  })

  it('should get 200 status code and an object with a single user data when trying to find an user by id', async () => {
    const { status, data } = await axios.get(`${ url }/${ userId }`, { headers: { Authorization } })

    expect(status).equal(200)
    expect(data.id).equal(userId)
    expect(typeof data.email).equal('string')
  })

  it('should get 400 status code when trying to find an user passing invalid id', async () => {
    await axios.get(`${ url }/test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "user_id" format')
    })
  })

  it('should get 404 status code when authenticated customer ID is different from request user_id', async () => {
    await axios.get(`${ url }/${ faker.string.uuid() }`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })

  it('should get 404 status code when user is not found', async () => {
    await userRepository.save({
      userId,
      email,
      password: hashDriver.hashString(password),
      level: LevelEnum.ROOT,
    })

    await axios.get(`${ url }/${ userId }`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
