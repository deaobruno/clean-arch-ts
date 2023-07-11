import axios from 'axios'
import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/ExpressDriver'
import InMemoryDriver from '../../../src/infra/drivers/InMemoryDriver'
import routes from '../../../src/infra/http/v1/routes'
import { User } from '../../../src/domain/User'

const user_id = faker.string.uuid()
const server = new ExpressDriver(3031)
const url = 'http://localhost:3031/api/v1/users'

describe('GET /users/:user_id', () => {
  before(() => server.start(routes.routes, routes.prefix))
  after(() => server.stop())

  it('should get 200 status code and an object with a single user data when trying to find an user by id', async () => {
    const findStub = sinon.stub(InMemoryDriver.prototype, 'find')
      .resolves([User.create({
        user_id,
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2
      })])
    const { status, data } = await axios.get(`${url}/${user_id}`)

    expect(status).equal(200)
    expect(data.id).equal(user_id)
    expect(typeof data.email).equal('string')

    findStub.restore()
  })

  it('should get 400 status code when trying to find an user passing invalid id', async () => {
    await axios.get(`${url}/test`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "user_id" format')
    })
  })

  it('should get 404 status code when user is not found', async () => {
    await axios.get(`${url}/${faker.string.uuid()}`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
