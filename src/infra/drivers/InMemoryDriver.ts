import Repository from '../../domain/repositories/Repository'

let data: any[] = []

export default abstract class InMemoryDriver<T extends { id?: string }> implements Repository<T> {
  async save(entity: T): Promise<T> {
    const { id } = entity

    if (await this.exists(id)) {
      data = data.map((item: any) => item.id === id ? entity : item)
    } else {
      data.push(entity)
    }

    return entity
  }

  async find(params: object = {}): Promise<T[]> {
    const dataKeys = Object.keys(data)
    const paramKeys = Object.keys(params)
    const result: T[] = []

    if (paramKeys.length > 0) {
      dataKeys.forEach((key: string) => {
        const item = data[key]

        paramKeys.forEach((paramKey: string) => {
          if (item[paramKey] === params[paramKey]) {
            result.push(item)
          }
        })
      })
    } else {
      data.forEach((item: any) => {
        result.push(item)
      })
    }

    return result
  }

  async findOne(params: object): Promise<T> {
    const results = await this.find(params)

    return results[0]
  }

  async findOneByID(id: string): Promise<T | undefined> {
    return this.findOne({ id })
  }

  async exists(id?: string): Promise<boolean> {
    return !!await this.findOne({ id })
  }

  async delete(id: string): Promise<void> {
    data = data.filter((item: any) => item.id !== id)
  }

  async deleteMany(filters?: object): Promise<void> {
    const items = await this.find(filters)

    items.forEach(async (item) => {
      if (item.id)
        await this.delete(item.id)
    })
  }
}
