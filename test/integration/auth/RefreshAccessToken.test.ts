import sinon from 'sinon'
import axios from 'axios'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver'
import httpRoutes from '../../../src/infra/http/v1/routes'
import InMemoryDriver from '../../../src/infra/drivers/db/InMemoryDriver'
import JwtDriver from '../../../src/infra/drivers/token/JwtDriver'
import dependencies from '../../../src/dependencies'
import config from '../../../src/config'

const sandbox = sinon.createSandbox()
const routes = httpRoutes(dependencies(config.app))
const server = new ExpressDriver(3031)
const url = 'http://localhost:3031/api/v1/auth/refresh-token'
let Authorization: string
let token: string

describe('POST /auth/refresh-token', () => {
  before(async () => {
    const authenticatePayload = {
      email: 'admin@email.com',
      password: '12345',
    }

    server.start(routes, '/api/v1')

    const { data: { accessToken, refreshToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', authenticatePayload)

    Authorization = `Bearer ${accessToken}`
    token = refreshToken
  })

  afterEach(() => sandbox.restore())

  after(() => server.stop())

  it('should get 200 status code when trying to refresh an access token', async () => {
    const { status, data: { accessToken } } = await axios.post(url, { refreshToken: token }, { headers: { Authorization }})

    expect(status).equal(200)
    expect(typeof accessToken).equal('string')
  })

  it('should get 401 status code when trying to refresh an access token without a previous refresh token', async () => {
    sandbox.stub(InMemoryDriver.prototype, 'findOne')
      .resolves()

    await axios.post(url, { refreshToken: token }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(401)
        expect(data.error).equal('Not authenticated user')
    })
  })

  it('should get 401 status code when refresh token is expired', async () => {
    sandbox.stub(JwtDriver.prototype, 'validateRefreshToken')
      .throws({ name: 'TokenExpiredError' })

    await axios.post(url, { refreshToken: token }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(401)
        expect(data.error).equal('Refresh token expired')
    })
  })

  it('should get 401 status code when refresh token is invalid', async () => {
    sandbox.stub(JwtDriver.prototype, 'validateRefreshToken')
      .throws({})

    await axios.post(url, { refreshToken: token }, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(401)
        expect(data.error).equal('Invalid refresh token')
    })
  })
})
