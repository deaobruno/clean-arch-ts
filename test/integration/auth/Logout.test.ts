import axios from 'axios'
import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver'
import httpRoutes from '../../../src/infra/http/v1/routes'
import InMemoryRefreshTokenRepository from '../../../src/adapters/repositories/inMemory/InMemoryRefreshTokenRepository'
import dependencies from '../../../src/dependencies'
import config from '../../../src/config'

const routes = httpRoutes(dependencies(config.app))
const server = new ExpressDriver(3031)
const url = 'http://localhost:3031/api/v1/auth/logout'
const adminEmail = 'admin@email.com'
let Authorization: string

describe('DELETE /auth/logout', () => {
  before(async () => {
    const authenticatePayload = {
      email: adminEmail,
      password: '12345',
    }

    server.start(routes, '/api/v1')

    const { data: { accessToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', authenticatePayload)

    Authorization = `Bearer ${accessToken}`
  })

  afterEach(() => sinon.restore())

  after(() => server.stop())

  it('should get 204 status code when successfully log an user out', async () => {
    const refreshToken = 'refresh-token'

    sinon.stub(InMemoryRefreshTokenRepository.prototype, 'findOneByToken')
      .resolves({
        userId: faker.string.uuid(),
        token: refreshToken,
      })

    const { status } = await axios.delete(url, { headers: { Authorization }, data: { refresh_token: refreshToken } })

    expect(status).equal(204)
  })

  it('should get 404 status code when refreshToken is not found', async () => {
    sinon.stub(InMemoryRefreshTokenRepository.prototype, 'findOneByToken')
      .resolves()

    await axios.delete(url, { headers: { Authorization }, data: { refresh_token: 'test' } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('Refresh token not found')
    })
  })
})
