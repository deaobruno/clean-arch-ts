export default interface IRepository<T> {
  collection?: string
  save(data: T, filters?: object): Promise<T>
  find(filters?: object): Promise<T[]>
  findOne(filters: object): Promise<T | undefined>
  delete(filters: object): Promise<void>
}
