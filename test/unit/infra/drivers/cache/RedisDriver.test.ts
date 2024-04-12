import sinon from 'sinon'
import { expect } from 'chai'
import config from "../../../../../src/config";
import RedisDriver from '../../../../../src/infra/drivers/cache/RedisDriver'
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver'

const sandbox = sinon.createSandbox()
const { url, password } = config.cache.redis

describe('/src/infra/drivers/cache/RedisDriver.ts', () => {
  afterEach(() => sandbox.restore())

  it('should start Redis client connection with default client', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisDriver = new RedisDriver(url, password, logger)
    const result = await redisDriver.connect()

    expect(result).equal(undefined)
  })

  it('should start Redis client connection with custom client', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisClient: any = {
      on: sandbox.stub(),
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      set: sandbox.stub(),
      get: sandbox.stub(),
      del: sandbox.stub(),
      isReady: false,
    }
    const redisDriver = new RedisDriver('url', 'password', logger, redisClient)

    redisClient.connect.resolves();

    const result = await redisDriver.connect()

    expect(result).equal(undefined)
  })

  it('should stop Redis client connection', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisClient: any = {
      on: sandbox.stub(),
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      set: sandbox.stub(),
      get: sandbox.stub(),
      del: sandbox.stub(),
      isReady: true,
    }
    const redisDriver = new RedisDriver('url', 'password', logger, redisClient)

    redisClient.disconnect.resolves()

    const result = await redisDriver.disconnect()

    expect(result).equal(undefined)
  })

  it('should store an object in Redis cache', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisClient: any = {
      on: sandbox.stub(),
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      set: sandbox.stub(),
      get: sandbox.stub(),
      del: sandbox.stub(),
      isReady: true,
    }
    const redisDriver = new RedisDriver('url', 'password', logger, redisClient)

    redisClient.set.resolves()

    const key = 'key'
    const data = { key: 'value' }
    const result = await redisDriver.set(key, data)

    expect(result).equal(undefined)
    expect(redisClient.set.calledOnceWith(key, JSON.stringify(data), { EX: 900 })).equal(true)
  })

  it('should get undefined when data does not exist in Redis cache', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisClient: any = {
      on: sandbox.stub(),
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      set: sandbox.stub(),
      get: sandbox.stub(),
      del: sandbox.stub(),
      isReady: true,
    }
    const redisDriver = new RedisDriver('url', 'password', logger, redisClient)

    redisClient.get.resolves()
    
    const key = 'key'
    const result = await redisDriver.get(key)

    expect(result).equal(undefined)
    expect(redisClient.get.calledOnceWith(key)).equal(true)
  })

  it('should get data from Redis cache', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisClient: any = {
      on: sandbox.stub(),
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      set: sandbox.stub(),
      get: sandbox.stub(),
      del: sandbox.stub(),
      isReady: true,
    }
    const redisDriver = new RedisDriver('url', 'password', logger, redisClient)
    const key = 'key'
    const data = { key: 'value' }
    
    redisClient.get.resolves(JSON.stringify(data))

    const result = await redisDriver.get(key)

    expect(result.key).equal(data.key)
    expect(redisClient.get.calledOnceWith(key)).equal(true)
  })

  it('should delete data in Redis cache', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisClient: any = {
      on: sandbox.stub(),
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      set: sandbox.stub(),
      get: sandbox.stub(),
      del: sandbox.stub(),
      isReady: true,
    }
    const redisDriver = new RedisDriver('url', 'password', logger, redisClient)
    const key = 'key'

    redisClient.del.resolves()

    const result = await redisDriver.del(key)

    expect(result).equal(undefined)
    expect(redisClient.del.calledOnceWith(key)).equal(true)
  })

  it('should return undefined when trying to save data to cache but client is not ready', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisClient: any = {
      on: sandbox.stub(),
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      set: sandbox.stub(),
      get: sandbox.stub(),
      del: sandbox.stub(),
      isReady: false,
    }
    const redisDriver = new RedisDriver('url', 'password', logger, redisClient)
    const result = await redisDriver.set('key', { key: 'value' })

    expect(result).equal(undefined)
    expect(redisClient.set.notCalled).equal(true)
  })

  it('should return undefined when trying to get data from cache but client is not ready', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisClient: any = {
      on: sandbox.stub(),
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      set: sandbox.stub(),
      get: sandbox.stub(),
      del: sandbox.stub(),
      isReady: false,
    }
    const redisDriver = new RedisDriver('url', 'password', logger, redisClient)
    const result = await redisDriver.get('key')

    expect(result).equal(undefined)
    expect(redisClient.get.notCalled).equal(true)
  })

  it('should return undefined when trying to delete data from cache but client is not ready', async () => {
    const logger = sandbox.createStubInstance(PinoDriver)
    const redisClient: any = {
      on: sandbox.stub(),
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      set: sandbox.stub(),
      get: sandbox.stub(),
      del: sandbox.stub(),
      isReady: false,
    }
    const redisDriver = new RedisDriver('url', 'password', logger, redisClient)
    const result = await redisDriver.del('key')

    expect(result).equal(undefined)
    expect(redisClient.del.notCalled).equal(true)
  })
})
