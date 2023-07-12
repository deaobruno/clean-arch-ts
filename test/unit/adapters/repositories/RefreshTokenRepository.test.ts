import sinon from 'sinon'
import { expect } from 'chai'
import RefreshTokenRepository from '../../../../src/adapters/repositories/RefreshTokenRepository'
import InMemoryDriver from '../../../../src/infra/drivers/InMemoryDriver'
import IRepository from '../../../../src/domain/repositories/IRepository'
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
    const fakeRefreshToken = { token: 'refresh-token' }

    sandbox.stub(InMemoryDriver.prototype, 'save')
      .resolves(fakeRefreshToken)

    const refreshToken = await refreshTokenRepository.save(fakeRefreshToken)

    expect(refreshToken.token).equal(fakeRefreshToken.token)
  })
})
