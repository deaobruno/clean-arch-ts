import axios from 'axios'
import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver'
import InMemoryDriver from '../../../src/infra/drivers/db/InMemoryDriver'
import routes from '../../../src/infra/http/v1/routes'
import { User } from '../../../src/domain/User'

const server = new ExpressDriver(3031)
const url = 'http://localhost:3031/api/v1/users'
const user_id = faker.string.uuid()
let Authorization: string

describe('PUT /users/:user_id', () => {
  before(async () => {
    const authenticatePayload = {
      email: 'admin@email.com',
      password: '12345',
    }

    server.start(routes.routes, routes.prefix)

    const { data: { accessToken } } = await axios.post('http://localhost:3031/api/v1/auth/login', authenticatePayload)

    Authorization = `Bearer ${accessToken}`
  })

  after(() => server.stop())

  it('should get 200 when trying to update an existing user', async () => {
    const user = User.create({
      user_id,
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: 2
    })
    const findStub = sinon.stub(InMemoryDriver.prototype, 'find')
      .resolves([user])
    const newEmail = faker.internet.email()
    const payload = {
      email: newEmail
    }
    const { status, data } = await axios.put(`${url}/${user_id}`, payload, { headers: { Authorization } })

    expect(status).equal(200)
    expect(data.id).equal(user.user_id)
    expect(data.email).equal(newEmail)

    findStub.restore()
  })

  it('should get 400 status code when trying to update an user passing invalid id', async () => {
    const payload = {
      email: faker.internet.email()
    }

    await axios.put(`${url}/test`, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "user_id" format')
    })
  })

  it('should get 400 status code when trying to update an user passing empty "email" as param', async () => {
    const payload = {
      email: ''
    }

    await axios.put(`${url}/${user_id}`, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"email" is required')
    })
  })

  it('should get 400 status code when trying to update an user passing invalid "email" as param', async () => {
    const payload = {
      email: 'test'
    }

    await axios.put(`${url}/${user_id}`, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "email" format')
    })
  })

  it('should get 400 status code when trying to update an user with invalid param', async () => {
    const payload = {
      test: 'test'
    }

    await axios.put(`${url}/${user_id}`, payload)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal(`Invalid param: "test"`)
    })
  })

  it('should get 404 status code when user is not found', async () => {
    const payload = {}

    await axios.put(`${url}/${faker.string.uuid()}`, payload, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
