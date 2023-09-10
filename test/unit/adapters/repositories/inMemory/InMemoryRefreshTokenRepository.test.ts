import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import RefreshTokenRepository from '../../../../../src/adapters/repositories/inMemory/InMemoryRefreshTokenRepository'
import InMemoryDriver from '../../../../../src/infra/drivers/db/InMemoryDriver'
import IRepository from '../../../../../src/infra/drivers/db/IDbDriver'
import IRefreshTokenRepository from '../../../../../src/domain/repositories/IRefreshTokenRepository'
import { RefreshTokenMapper } from '../../../../../src/domain/mappers/RefreshTokenMapper'
import { RefreshToken } from '../../../../../src/domain/RefreshToken'

const sandbox = sinon.createSandbox()
let inMemoryDriver: IRepository
let refreshTokenMapper: RefreshTokenMapper
let refreshTokenRepository: IRefreshTokenRepository

describe('/adapters/repositories/inMemory/InMemoryRefreshTokenRepository', () => {
  beforeEach(() => {
    inMemoryDriver = new InMemoryDriver()
    refreshTokenMapper = new RefreshTokenMapper()
    refreshTokenRepository = new RefreshTokenRepository(inMemoryDriver, refreshTokenMapper)
  })

  afterEach(() => sandbox.restore())

  it('should save a RefreshToken entity in DB', async () => {
    const userId = faker.string.uuid()
    const token = 'refresh-token'
    const fakeRefreshToken = { userId, token }

    sandbox.stub(RefreshToken, 'create')
      .returns({
        userId,
        token,
      })
    sandbox.stub(refreshTokenMapper, 'entityToDb')
      .returns({
        user_id: userId,
        token,
      })
    sandbox.stub(inMemoryDriver, 'save')
      .resolves(fakeRefreshToken)

    const refreshToken = await refreshTokenRepository.save(fakeRefreshToken)

    expect(refreshToken.userId).equal(fakeRefreshToken.userId)
    expect(refreshToken.token).equal(fakeRefreshToken.token)
  })

  it('should return all RefreshTokens from DB when no filter is passed', async () => {
    const dbRefreshTokens = [
      {
        user_id: faker.string.uuid(),
        token: 'refresh-token-1'
      },
      {
        user_id: faker.string.uuid(),
        token: 'refresh-token-2'
      },
      {
        user_id: faker.string.uuid(),
        token: 'refresh-token-3'
      },
    ]

    sandbox.stub(inMemoryDriver, 'find')
      .resolves(dbRefreshTokens)
    sandbox.stub(refreshTokenMapper, 'dbToEntity')
      .withArgs(dbRefreshTokens[0])
      .returns({
        userId: dbRefreshTokens[0].user_id,
        token: dbRefreshTokens[0].token,
      })
      .withArgs(dbRefreshTokens[1])
      .returns({
        userId: dbRefreshTokens[1].user_id,
        token: dbRefreshTokens[1].token,
      })
      .withArgs(dbRefreshTokens[2])
      .returns({
        userId: dbRefreshTokens[2].user_id,
        token: dbRefreshTokens[2].token,
      })

    const refreshTokens = await refreshTokenRepository.find()

    expect(refreshTokens[0].userId).equal(dbRefreshTokens[0].user_id)
    expect(refreshTokens[0].token).equal(dbRefreshTokens[0].token)
    expect(refreshTokens[1].userId).equal(dbRefreshTokens[1].user_id)
    expect(refreshTokens[1].token).equal(dbRefreshTokens[1].token)
    expect(refreshTokens[2].userId).equal(dbRefreshTokens[2].user_id)
    expect(refreshTokens[2].token).equal(dbRefreshTokens[2].token)
  })

  it('should return filtered RefreshTokens from DB when some filter is passed', async () => {
    const userId = faker.string.uuid()
    const dbRefreshTokens = [
      {
        user_id: userId,
        token: 'refresh-token-1'
      },
      {
        user_id: userId,
        token: 'refresh-token-2'
      },
    ]

    sandbox.stub(inMemoryDriver, 'find')
      .resolves(dbRefreshTokens)
    sandbox.stub(refreshTokenMapper, 'dbToEntity')
      .withArgs(dbRefreshTokens[0])
      .returns({
        userId: dbRefreshTokens[0].user_id,
        token: dbRefreshTokens[0].token,
      })
      .withArgs(dbRefreshTokens[1])
      .returns({
        userId: dbRefreshTokens[1].user_id,
        token: dbRefreshTokens[1].token,
      })

    const refreshTokens = await refreshTokenRepository.find({ user_id: userId })

    expect(refreshTokens[0].userId).equal(dbRefreshTokens[0].user_id)
    expect(refreshTokens[0].token).equal(dbRefreshTokens[0].token)
    expect(refreshTokens[1].userId).equal(dbRefreshTokens[1].user_id)
    expect(refreshTokens[1].token).equal(dbRefreshTokens[1].token)
  })

  it('should return an empty array when no RefreshTokens are found', async () => {
    const dbRefreshTokens: any[] = []

    sandbox.stub(inMemoryDriver, 'find')
      .resolves(dbRefreshTokens)

    const refreshTokens = await refreshTokenRepository.find()

    expect(refreshTokens.length).equal(0)
  })

  it('should return a RefreshToken from DB when some filter is passed', async () => {
    const userId = faker.string.uuid()
    const token = 'refresh-token'

    sandbox.stub(inMemoryDriver, 'findOne')
      .resolves({
        user_id: userId,
        token,
      })
    sandbox.stub(refreshTokenMapper, 'dbToEntity')
      .returns({
        userId,
        token,
      })

    const refreshToken = await refreshTokenRepository.findOne({ user_id: userId })

    expect(refreshToken.userId).equal(userId)
    expect(refreshToken.token).equal(token)
  })

  it('should return undefined when no RefreshToken is found', async () => {
    sandbox.stub(inMemoryDriver, 'findOne')
      .resolves()

    const refreshToken = await refreshTokenRepository.findOne({ user_id: 'test' })

    expect(refreshToken).equal(undefined)
  })

  it('should return a RefreshToken from DB passing "userId" as a filter', async () => {
    const userId = faker.string.uuid()
    const token = 'refresh-token'

    sandbox.stub(inMemoryDriver, 'findOne')
      .resolves({
        user_id: userId,
        token,
      })
    sandbox.stub(refreshTokenMapper, 'dbToEntity')
      .returns({
        userId,
        token,
      })

    const refreshToken = <RefreshToken>await refreshTokenRepository.findOneByUserId(userId)

    expect(refreshToken.userId).equal(userId)
    expect(refreshToken.token).equal(token)
  })

  it('should return undefined when no RefreshToken is found passing "userId" as a filter', async () => {
    sandbox.stub(inMemoryDriver, 'findOne')
      .resolves()

    const refreshToken = await refreshTokenRepository.findOneByUserId('test')

    expect(refreshToken).equal(undefined)
  })

  it('should return a RefreshToken from DB passing "token" as a filter', async () => {
    const userId = faker.string.uuid()
    const token = 'refresh-token'

    sandbox.stub(inMemoryDriver, 'findOne')
      .resolves({
        user_id: userId,
        token,
      })
    sandbox.stub(refreshTokenMapper, 'dbToEntity')
      .returns({
        userId,
        token,
      })

    const refreshToken = <RefreshToken>await refreshTokenRepository.findOneByToken(token)

    expect(refreshToken.userId).equal(userId)
    expect(refreshToken.token).equal(token)
  })

  it('should return undefined when no RefreshToken is found passing "token" as a filter', async () => {
    sandbox.stub(inMemoryDriver, 'findOne')
      .resolves()

    const refreshToken = await refreshTokenRepository.findOneByToken('test')

    expect(refreshToken).equal(undefined)
  })

  it('should delete a RefreshToken from DB', async () => {
    sandbox.stub(inMemoryDriver, 'delete')
      .resolves()

    const result = await refreshTokenRepository.delete({ user_id: 'test' })

    expect(result).equal(undefined)
  })
})
