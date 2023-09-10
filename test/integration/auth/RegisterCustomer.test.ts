import axios from 'axios'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver'
import httpRoutes from '../../../src/infra/http/v1/routes'
import dependencies from '../../../src/dependencies'
import config from '../../../src/config'

const routes = httpRoutes(dependencies(config.app))
const server = new ExpressDriver(3031)
const url = 'http://localhost:3031/api/v1/auth/register'

describe('POST /auth/register', () => {
  before(() => server.start(routes, '/api/v1'))

  after(() => server.stop())

  it('should get status 201 when successfully registered a new customer', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '12345',
      confirm_password: '12345',
    }
    const { status, data } = await axios.post(url, payload)

    expect(status).equal(201)
    expect(typeof data.id).equal('string')
    expect(data.email).equal(payload.email)
  })

  it('should get status 400 when trying to register a customer without "email"', async () => {
    const payload = {
      email: '',
      password: '12345',
      confirm_password: '12345',
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"email" is required')
      })
  })

  it('should get status 400 when trying to register a customer with invalid "email"', async () => {
    const payload = {
      email: 'test',
      password: '12345',
      confirm_password: '12345',
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "email" format')
      })
  })

  it('should get status 400 when trying to register a customer without "password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '',
      confirm_password: '12345',
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"password" is required')
      })
  })

  it('should get status 400 when trying to register a customer without "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '12345',
      confirm_password: '',
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"confirm_password" is required')
      })
  })

  it('should get status 400 when trying to register a customer with different "password" and "confirm_password"', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '12345',
      confirm_password: '1234',
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Passwords mismatch')
      })
  })

  it('should get status 400 when trying to register a customer with invalid param', async () => {
    const payload = {
      email: faker.internet.email(),
      password: '12345',
      confirm_password: '12345',
      test: true,
    }

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid param(s): "test"')
      })
  })

  it('should get status 409 when trying to register a customer with an previously registered email', async () => {
    const email = faker.internet.email()
    const payload = {
      email,
      password: '12345',
      confirm_password: '12345',
    }

    await axios.post(url, payload)

    await axios.post(url, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(409)
        expect(data.error).equal('Email already in use')
      })
  })
})
