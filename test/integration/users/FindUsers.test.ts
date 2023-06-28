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

describe('GET /users', () => {
  before(() => server.start(routes.routes, routes.prefix))
  after(() => server.stop())

  it('should get 200 status code and an array with users data when trying to find users without filters', async () => {
    const users = [
      User.create({
        user_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2
      }),
      User.create({
        user_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2
      }),
      User.create({
        user_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2
      }),
    ]
    const findStub = sinon.stub(InMemoryDriver.prototype, 'find')
      .resolves(users)
    const { status, data } = await axios.get(`${url}`)

    expect(status).equal(200)
    expect(data.length).equal(3)
    expect(data[0].id).equal(users[0].user_id)
    expect(data[0].email).equal(users[0].email)
    expect(data[1].id).equal(users[1].user_id)
    expect(data[1].email).equal(users[1].email)
    expect(data[2].id).equal(users[2].user_id)
    expect(data[2].email).equal(users[2].email)

    findStub.restore()
  })

  it('should get 200 status code and an array with users data when trying to find users with filters', async () => {
    const users = [
      User.create({
        user_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        level: 2
      }),
    ]
    const findStub = sinon.stub(InMemoryDriver.prototype, 'find')
      .resolves(users)
    const { status, data } = await axios.get(`${url}?email=${users[0].email}`)

    expect(status).equal(200)
    expect(data.length).equal(1)
    expect(data[0].id).equal(users[0].user_id)
    expect(data[0].email).equal(users[0].email)

    findStub.restore()
  })

  it('should get 400 status code when trying to find users passing empty "email" as filter', async () => {
    await axios.get(`${url}?email=`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('"email" is required')
    })
  })

  it('should get 400 status code when trying to find users passing invalid "email" as filter', async () => {
    await axios.get(`${url}?email=test`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal('Invalid "email" format')
    })
  })

  it('should get 400 status code when trying to find users passing invalid param as filter', async () => {
    await axios.get(`${url}?test=test`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400)
        expect(data.error).equal(`Invalid param: "test"`)
    })
  })

  it('should get 404 status code when no users are found', async () => {
    await axios.get(`${url}?email=test@test.com`)
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('Users not found')
    })
  })
})
