import { expect } from 'chai'
import InMemoryDriver from '../../../../src/infra/drivers/db/InMemoryDriver'

class InMemoryCustomRepository {
  constructor(private _driver: InMemoryDriver) {}

  async save(entity: any) {
    return this._driver.save('source', entity, { id: entity.id })
  }

  find = (filters?: object) => (this._driver.find)('source', filters)
  findOne = (filters: object) => (this._driver.findOne)('source', filters)
  delete = (filters = {}) => (this._driver.delete)('source', filters)
}

const inMemoryDriver = InMemoryDriver.getInstance()
const customRepository = new InMemoryCustomRepository(inMemoryDriver)

describe('/infra/drivers/InMemoryDriver.ts', () => {
  afterEach(async () => {
    const items = await customRepository.find()

    items.forEach(async item => {
      const { id } = item

      await customRepository.delete({ id })
    })
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

    const customObj2 = {
      id: '2',
      test: false
    }

    await customRepository.save(customObj2)

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

  it('should delete one item passing an ID as a filter', async () => {
    const customObj = {
      id: '1',
      test: true
    }

    await customRepository.save(customObj)

    await customRepository.delete({ id: customObj.id })

    const result = await customRepository.find()

    expect(result).length(0)
  })
})
