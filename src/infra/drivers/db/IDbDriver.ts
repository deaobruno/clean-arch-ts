export default interface IDbDriver {
  save(data: any, filters?: object): Promise<any>
  find(filters?: object): Promise<any[]>
  findOne(filters: object): Promise<any | undefined>
  delete(filters: object): Promise<void>
}
