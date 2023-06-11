import Repository from "../../domain/repositories/Repository"

let data: any[] = []

export default abstract class InMemoryDriver<T> implements Repository<T> {
  async save(entity: T, id?: string): Promise<T> {
    if (id && await this.exists(id))
      data = data.map((item: any) => item.id === id ? entity : item)
    else
      data.push(entity)

    return entity
  }

  async find(filters: object = {}): Promise<T[]> {
    const dataKeys = Object.keys(data)
    const paramKeys = Object.keys(filters)
    const result: T[] = []

    if (paramKeys.length > 0) {
      dataKeys.forEach((key: string) => {
        const item = data[key]
        let found = true

        paramKeys.forEach((paramKey: string) => {
          if (item[paramKey] !== filters[paramKey])
            found = false
        })

        if (found)
          result.push(item)
      })
    } else {
      data.forEach((item: any) => result.push(item))
    }

    return result
  }

  async findOne(filters: object): Promise<T> {
    const results = await this.find(filters)

    return results[0]
  }

  abstract findOneById(id?: string): Promise<T | undefined>

  async exists(id?: string): Promise<boolean> {
    return !!await this.findOneById(id)
  }

  async delete(filters: object): Promise<void> {
    data = data.filter((item: any) => {
      let found = true

      Object.keys(filters).forEach((paramKey: string) => {
        if (item[paramKey] !== filters[paramKey])
          found = false
      })

      if (!found)
        return item
    })
  }
}
