import { expect } from 'chai'
import InMemoryDriver from '../../../../src/infra/drivers/InMemoryDriver'

type CustomEntity = {
  id: string
  test: boolean
}

class InMemoryCustomRepository extends InMemoryDriver<CustomEntity> {}

const customRepository = new InMemoryCustomRepository()

describe('/infra/drivers/InMemoryDriver.ts', () => {
  afterEach(async () => {
    await customRepository.deleteMany()
  })

  it('should save a new item', async () => {
    const customObj = {
      id: '1',
      test: true
    }
    const result = await customRepository.save(customObj)

    expect(result).deep.equal(customObj)
  })

  it('should update an existing item', async () => {
    const customObj = {
      id: '1',
      test: true
    }

    await customRepository.save(customObj)

    customObj.test = false

    const result = await customRepository.save(customObj)

    expect(result.id).equal(customObj.id)
    expect(result.test).equal(false)
  })

  it('should find all items', async () => {
    const itemsCount = 2

    for (let i = 0; i < itemsCount; i++)
      await customRepository.save({
        id: `${i}`,
        test: true
      })

    const items = await customRepository.find()

    expect(items).length(itemsCount)
  })

  it('should find items passing a filter', async () => {
    const matchingItemsCount = 2

    for (let i = 0; i < matchingItemsCount; i++)
      await customRepository.save({
        id: `${i}`,
        test: true
      })

    await customRepository.save({
      id: '3',
      test: false
    })

    const items = await customRepository.find({ test: true })

    expect(items).length(matchingItemsCount)
  })

  it('should return an empty array when no filters match in find', async () => {
    for (let i = 0; i < 2; i++)
      await customRepository.save({
        id: `${i}`,
        test: true
      })

    const items = await customRepository.find({ test: false })

    expect(items).length(0)
  })

  it('should find one item passing a filter', async () => {
    for (let i = 0; i < 2; i++)
      await customRepository.save({
        id: `${i}`,
        test: true
      })

    const customObj = {
      id: '3',
      test: false
    }

    await customRepository.save(customObj)

    const result = await customRepository.findOne({ test: false })

    expect(result).deep.equal(customObj)
  })

  it('should find one item passing an ID as a filter', async () => {
    const customObj = {
      id: '1',
      test: true
    }

    await customRepository.save(customObj)

    const result = await customRepository.findOneByID(customObj.id)

    expect(result).deep.equal(customObj)
  })

  it('should return true when validating item existence using right ID as a filter', async () => {
    const customObj = {
      id: '1',
      test: true
    }

    await customRepository.save(customObj)

    const result = await customRepository.exists(customObj.id)

    expect(result).equal(true)
  })

  it('should return false when validating item existence using wrong ID as a filter', async () => {
    const customObj = {
      id: '1',
      test: true
    }

    await customRepository.save(customObj)

    const result = await customRepository.exists('2')

    expect(result).equal(false)

  })

  it('should delete one item passing an ID as a filter', async () => {
    const customObj = {
      id: '1',
      test: true
    }

    await customRepository.save(customObj)

    await customRepository.delete(customObj.id)

    const result = await customRepository.find()

    expect(result).length(0)
  })

  it('should delete many items passing a filter', async () => {
    for (let i = 0; i < 2; i++)
      await customRepository.save({
        id: `${i}`,
        test: true
      })

    const customObj = {
      id: '3',
      test: false
    }

    await customRepository.save(customObj)

    await customRepository.deleteMany({ test: true })

    const result = await customRepository.find()

    expect(result).length(1)
  })

  it('should delete all items', async () => {
    for (let i = 0; i < 2; i++)
      await customRepository.save({
        id: `${i}`,
        test: true
      })

    await customRepository.deleteMany()

    const result = await customRepository.find()

    expect(result).length(0)
  })
})
