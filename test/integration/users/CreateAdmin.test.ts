import axios from 'axios'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver'
import routes from '../../../src/infra/http/v1/routes'

const server = new ExpressDriver(3031)
const url = 'http://localhost:3031/api/v1/users/create-admin'
const adminEmail = 'admin@email.com'
const password = faker.internet.password()
let Authorization: string

describe('POST /users/create-admin', () => {
  before(async () => {
    const authenticatePayload = {
      email: adminEmail,
      password: '12345',
    }

    server.start(routes.routes, routes.prefix)

    const { data: { accessToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', authenticatePayload)

    Authorization = `Bearer ${accessToken}`
  })

  after(() => server.stop())

  it('should get status 201 when successfully registered a new admin', async () => {
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: password,
    }
    const { status, data } = await axios.post(url, payload, { headers: { Authorization } })

    expect(status).equal(201)
    expect(typeof data.id).equal('string')
    expect(data.email).equal(payload.email)
  })

  it('should get status 400 when trying to register a admin without "email"', async () => {
    const payload = {
      email: '',
      password,
      confirm_password: password,
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"email" is required')
      })
  })

  it('should get status 400 when trying to register a admin with invalid "email"', async () => {
    const payload = {
      email: 'test',
      password,
      confirm_password: password,
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "email" format')
      })
  })

  it('should get status 400 when trying to register a admin without "password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '',
      confirm_password: password,
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"password" is required')
      })
  })

  it('should get status 400 when trying to register a admin without "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: '',
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"confirm_password" is required')
      })
  })

  it('should get status 400 when trying to register a admin with different "password" and "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: 'test',
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Passwords mismatch')
      })
  })

  it('should get status 400 when trying to register a admin with invalid param', async () => {
    const payload = {
      email: faker.internet.email(),
      password,
      confirm_password: password,
      test: true,
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid param: "test"')
      })
  })

  it('should get status 409 when trying to register an admin with a previously registered email', async () => {
    const payload = {
      email: adminEmail,
      password,
      confirm_password: password,
    }

    await axios.post(url, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(409)
        expect(data.error).equal('Email already in use')
      })
  })
})
