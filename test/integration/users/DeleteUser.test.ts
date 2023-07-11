import axios from 'axios'
import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/ExpressDriver'
import InMemoryDriver from '../../../src/infra/drivers/InMemoryDriver'
import routes from '../../../src/infra/http/v1/routes'
import { User } from '../../../src/domain/User'

const server = new ExpressDriver(3031)
const url = 'http://localhost:3031/api/v1/users'
const user_id = faker.string.uuid()

describe('DELETE /users', () => {
  before(() => server.start(routes.routes, routes.prefix))
  after(() => server.stop())

  it('should get 204 status code when trying to delete an existing user', async () => {
    const findStub = sinon.stub(InMemoryDriver.prototype, 'find')
      .resolves([User.create({
        user_id,
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2
      })])
    const { status } = await axios.delete(`${url}/${user_id}`)

    expect(status).equal(204)

    findStub.restore()
  })

  it('should get 400 status code when trying to delete an user passing invalid id', async () => {
    await axios.delete(`${url}/test`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "user_id" format')
    })
  })

  it('should get 404 status code when trying to delete an user with wrong id', async () => {
    await axios.delete(`${url}/${faker.string.uuid()}`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
