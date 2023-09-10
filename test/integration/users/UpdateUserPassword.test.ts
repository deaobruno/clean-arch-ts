import axios from 'axios'
import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver'
import { User } from '../../../src/domain/User'
import UserRepository from '../../../src/adapters/repositories/inMemory/InMemoryUserRepository'
import httpRoutes from '../../../src/infra/http/v1/routes'
import config from '../../../src/config'
import dependencies from '../../../src/dependencies'

const routes = httpRoutes(dependencies(config.app))
const server = new ExpressDriver(3031)
const userId = faker.string.uuid()
const url = `http://localhost:3031/api/v1/users/${userId}/update-password`
let Authorization: string

describe('PUT /users/:user_id/update-password', () => {
  before(async () => {
    const authenticatePayload = {
      email: 'admin@email.com',
      password: '12345',
    }

    server.start(routes, '/api/v1')

    const { data: { accessToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', authenticatePayload)

    Authorization = `Bearer ${accessToken}`
  })

  after(() => server.stop())

  it('should get 200 when trying to update an existing user', async () => {
    const user = User.create({
      userId,
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: 2
    })
    const findStub = sinon.stub(UserRepository.prototype, 'findOne')
      .resolves(user)
    const newPassword = faker.internet.password()
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    }
    const { status, data } = await axios.put(`${url}`, payload, { headers: { Authorization } })

    expect(status).equal(200)
    expect(data.id).equal(user.userId)
    expect(data.email).equal(user.email)

    findStub.restore()
  })

  it('should get 400 status code when trying to update an user passing invalid id', async () => {
    const newPassword = faker.internet.password()
    const payload = {
      password: newPassword,
      confirm_password: newPassword,
    }

    await axios.put(`http://localhost:3031/api/v1/users/test/update-password`, payload, { headers: { Authorization } })
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

    await axios.put(`${url}`, payload, { headers: { Authorization } })
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

    await axios.put(`${url}`, payload, { headers: { Authorization } })
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

    await axios.put(`${url}`, payload, { headers: { Authorization } })
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

    await axios.put(`http://localhost:3031/api/v1/users/${faker.string.uuid()}/update-password`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
