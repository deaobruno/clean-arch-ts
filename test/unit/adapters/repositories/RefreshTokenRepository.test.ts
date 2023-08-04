import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import RefreshTokenRepository from '../../../../src/adapters/repositories/RefreshTokenRepository'
import InMemoryDriver from '../../../../src/infra/drivers/db/InMemoryDriver'
import IRepository from '../../../../src/infra/drivers/db/IDbDriver'
import IRefreshTokenRepository from '../../../../src/domain/repositories/IRefreshTokenRepository'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository<any>
let refreshTokenRepository: IRefreshTokenRepository

describe('/adapters/repositories/UserRepository', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    refreshTokenRepository = new RefreshTokenRepository(inMemoryDriver)
  })

  afterEach(() => sandbox.restore())

  it('should save an User entity', async () => {
    const fakeRefreshToken = { user_id: faker.string.uuid(), token: 'refresh-token' }

    sandbox.stub(InMemoryDriver.prototype, 'save')
      .resolves(fakeRefreshToken)

    const refreshToken = await refreshTokenRepository.save(fakeRefreshToken)

    expect(refreshToken.token).equal(fakeRefreshToken.token)
  })
})
