import axios from 'axios'
import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ExpressDriver from '../../../src/infra/drivers/ExpressDriver'
import InMemoryDriver from '../../../src/infra/drivers/InMemoryDriver'
import routes from '../../../src/infra/http/routes'
import { User } from '../../../src/domain/User'

const user_id = faker.datatype.uuid()
const server = new ExpressDriver(8080)
const url = 'http://localhost:8080/api/v1/users'

describe('GET /users/:user_id', () => {
  before(() => server.start(routes))
  after(() => server.stop())

  it('should get 200 status code when trying to find an user by id', async () => {
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

  it('should get 404 status code when trying to delete an user with wrong id', async () => {
    await axios.delete(`${url}/test`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
