export default {
  save(data: any, filters?: object): Promise<any> {
    return Promise.resolve(data)
  },
  find(filters?: object): Promise<any[]> {
    return Promise.resolve([])
  },
  findOne(filters: object): Promise<any> {
    return Promise.resolve()
  },
  delete(filters: object): Promise<void> {
    return Promise.resolve()
  },
}
