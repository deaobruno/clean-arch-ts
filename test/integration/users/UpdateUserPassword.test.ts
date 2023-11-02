import axios from 'axios'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import { LevelEnum } from '../../../src/domain/User'
import InMemoryUserRepository from '../../../src/adapters/repositories/inMemory/InMemoryUserRepository'
import config from '../../../src/config'
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
let url: string
let userId: string
let email: string
let password: string
let Authorization: string

describe('PUT /users/:user_id/update-password', () => {
  before(() => server.start())

  beforeEach(async () => {
    userId = faker.string.uuid()
    email = faker.internet.email()
    password = faker.internet.password()

    await userRepository.save({
      userId,
      email,
      password: hashDriver.hashString(password),
      level: LevelEnum.CUSTOMER,
    })

    const { data: { accessToken } } = await axios.post('http://localhost:8080/api/v1/auth/login', {
      email,
      password,
    })

    url = `http://localhost:8080/api/v1/users/${ userId }/update-password`
    Authorization = `Bearer ${ accessToken }`
  })

  after(async () => {
    await userRepository.delete()
    await refreshTokenRepository.delete()

    server.stop()
  })

  it('should get 200 when trying to update the password of an existing user', async () => {
    const newPassword = faker.internet.password()
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    }
    const { status, data } = await axios.put(url, payload, { headers: { Authorization } })

    password = newPassword

    expect(status).equal(200)
    expect(data.id).equal(userId)
    expect(data.email).equal(email)
  })

  it('should get 400 status code when trying to update an user passing invalid id', async () => {
    const newPassword = faker.internet.password()
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    }

    await axios.put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "user_id" format')
    })
  })

  it('should get 400 status code when trying to update an user passing empty "password" as param', async () => {
    const payload = {
      password: '',
      confirm_password: faker.internet.password(),
    }

    await axios.put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"password" is required')
    })
  })

  it('should get 400 status code when trying to update an user passing empty "confirm_password" as param', async () => {
    const payload = {
      password: faker.internet.password(),
      confirm_password: '',
    }

    await axios.put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"confirm_password" is required')
    })
  })

  it('should get 400 status code when trying to update an user password passing invalid param', async () => {
    const newPassword = faker.internet.password()
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
      test: 'test',
    }

    await axios.put(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal(`Invalid param(s): "test"`)
    })
  })

  it('should get 404 status code when user is not found', async () => {
    const newPassword = faker.internet.password()
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    }

    await axios.put(`http://localhost:8080/api/v1/users/${ faker.string.uuid() }/update-password`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })

  it('should get 404 status code when authenticated customer is different from token user', async () => {
    const userId = faker.string.uuid()
    const email = faker.internet.email()
    const newPassword = faker.internet.password()
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    }

    await userRepository.save({
      userId,
      email,
      password: hashDriver.hashString(password),
      level: LevelEnum.ROOT,
    })

    const { data: { accessToken } } = await axios.post('http://localhost:8080/api/v1/auth/login', {
      email,
      password,
    })

    Authorization = `Bearer ${ accessToken }`

    await axios.put(`http://localhost:8080/api/v1/users/${ userId }/update-password`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
