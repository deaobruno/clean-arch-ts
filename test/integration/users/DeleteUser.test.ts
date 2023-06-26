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

describe.only('DELETE /users', () => {
  before(() => server.start(routes))
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

  it('should get 404 status code when trying to delete an user with wrong id', async () => {
    await axios.delete(`${url}/test`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('User not found')
    })
  })
})
