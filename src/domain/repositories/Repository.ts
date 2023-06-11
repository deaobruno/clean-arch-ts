export default interface Repository<T> {
  save(data: T, id?: string): Promise<T>
  find(filters?: object): Promise<T[]>
  findOne(filters: object): Promise<T | undefined>
  findOneById(id: string): Promise<T | undefined>
  exists(id: string): Promise<boolean>
  delete(filters: object): Promise<void>
}
