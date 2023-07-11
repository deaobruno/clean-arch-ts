import axios from 'axios'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/ExpressDriver'
import routes from '../../../src/infra/http/v1/routes'

const server = new ExpressDriver(3031)
const registerUrl = 'http://localhost:3031/api/v1/auth/register'
const url = 'http://localhost:3031/api/v1/auth'
const email = faker.internet.email()
const password = faker.internet.password()

describe('POST /auth', () => {
  before(async () => {
    const payload = {
      email,
      password,
      confirm_password: password,
    }

    server.start(routes.routes, routes.prefix)

    await axios.post(registerUrl, payload)
  })

  after(() => server.stop())

  it('should get status 200 when successfully authenticated an user', async () => {
    const payload = {
      email,
      password,
    }
    const { status, data } = await axios.post(url, payload)

    expect(status).equal(200)
    expect(typeof data.token).equal('string')
  })

  it('should get status 400 when trying to authenticate an user without "email"', async () => {
    const payload = {
      email: '',
      password,
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"email" is required')
      })
  })

  it('should get status 400 when trying to authenticate an user with invalid "email"', async () => {
    const payload = {
      email: 'test',
      password,
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "email" format')
      })
  })

  it('should get status 400 when trying to authenticate an user without "password"', async () => {
    const payload = {
      email,
      password: '',
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"password" is required')
      })
  })

  it('should get status 400 when trying to authenticate an user with invalid param', async () => {
    const payload = {
      email,
      password,
      test: true,
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid param: "test"')
      })
  })

  it('should get status 401 when trying to authenticate an user that does not exist', async () => {
    const payload = {
      email: faker.internet.email(),
      password,
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(401)
        expect(data.error).equal('Unauthorized')
      })
  })

  it('should get status 401 when trying to authenticate an existing user with wrong password', async () => {
    const payload = {
      email,
      password: 'test',
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(401)
        expect(data.error).equal('Unauthorized')
      })
  })
})
