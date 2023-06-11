export default interface Repository<T> {
  save(data: T, id?: string): Promise<T>
  find(params?: object): Promise<T[]>
  findOne(params: object): Promise<T | undefined>
  findOneById(id: string): Promise<T | undefined>
  exists(id: string): Promise<boolean>
  delete(id: string): Promise<void>
}
