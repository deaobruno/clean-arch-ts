import axios from 'axios'
import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/server/ExpressDriver'
import routes from '../../../src/infra/http/v1/routes'
import { User } from '../../../src/domain/User'
import UserRepository from '../../../src/adapters/repositories/inMemory/InMemoryUserRepository'

const server = new ExpressDriver(3031)
const url = 'http://localhost:3031/api/v1/users'
const userId = faker.string.uuid()
let Authorization: string

describe('DELETE /users', () => {
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

  it('should get 204 status code when trying to delete an existing user', async () => {
    const findStub = sinon.stub(UserRepository.prototype, 'findOne')
      .resolves(User.create({
        userId,
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2
      }))
    const { status } = await axios.delete(`${url}/${userId}`, { headers: { Authorization } })

    expect(status).equal(204)

    findStub.restore()
  })

  it('should get 400 status code when trying to delete an user passing invalid id', async () => {
    await axios.delete(`${url}/test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "user_id" format')
    })
  })

  it('should get 404 status code when trying to delete an user with wrong id', async () => {
    await axios.delete(`${url}/${faker.string.uuid()}`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
