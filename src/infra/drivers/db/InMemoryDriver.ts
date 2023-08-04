import IDbDriver from './IDbDriver'

export default class InMemoryDriver implements IDbDriver<any> {
  data: any[] = []

  async save(entity: any, filters?: object): Promise<any> {
    const item = filters && await this.findOne(filters)

    if (item) {
      const filterKeys = Object.keys(filters)

      this.data = this.data.map((item: any) => {
        let found = true

        filterKeys.forEach(paramKey => found = (item[paramKey] === filters[paramKey]) ? true : false)

        return found ? entity : item
      })
    } else
      this.data.push(entity)

    return entity
  }

  async find(filters: object = {}): Promise<any[]> {
    const filterKeys = Object.keys(filters)
    const result: any[] = []

    if (filterKeys.length <= 0) return this.data

    this.data.forEach((item: any) => {
      let found = true

      filterKeys.forEach(paramKey => found = (item[paramKey] === filters[paramKey]) ? true : false)

      if (found)
        result.push(item)
    })

    return result
  }

  async findOne(filters: object): Promise<any> {
    const results = await this.find(filters)

    return results[0]
  }

  async delete(filters: object): Promise<void> {
    this.data = this.data.filter((item: any) => {
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
