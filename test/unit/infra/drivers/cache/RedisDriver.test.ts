import sinon from 'sinon'
import { createClient } from 'redis'
import { expect } from 'chai'
import RedisDriver from '../../../../../src/infra/drivers/cache/RedisDriver'
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver'

const sandbox = sinon.createSandbox()
const logger = sinon.createStubInstance(PinoDriver)
const redisClient = createClient()
const redisDriver = new RedisDriver('url', 'password', logger, redisClient)

describe('/src/infra/drivers/cache/RedisDriver.ts', () => {
  afterEach(() => sandbox.restore())

  it('should start Redis client connection', async () => {
    sandbox.stub(redisClient, 'connect').resolves()

    const result = await redisDriver.connect()

    expect(result).equal(undefined)
  })

  it('should stop Redis client connection', async () => {
    sandbox.stub(redisClient, 'disconnect').resolves()

    const result = await redisDriver.disconnect()

    expect(result).equal(undefined)
  })

  it('should store an object in Redis cache', async () => {
    sandbox.stub(redisClient, 'set').resolves()

    const result = await redisDriver.set('key', { key: 'value' })

    expect(result).equal(undefined)
  })

  it('should get undefined when data does not exist in Redis cache', async () => {
    const data = { key: 'value' }

    sandbox.stub(redisClient, 'get').resolves()

    const result = await redisDriver.get('key')

    expect(result).equal(undefined)
  })

  it('should get data from Redis cache', async () => {
    const data = { key: 'value' }

    sandbox.stub(redisClient, 'get').resolves(JSON.stringify(data))

    const result = await redisDriver.get('key')

    expect(result.key).equal(data.key)
  })

  it('should delete data in Redis cache', async () => {
    sandbox.stub(redisClient, 'del').resolves()

    const result = await redisDriver.del('key')

    expect(result).equal(undefined)
  })
})