export default interface IDbDriver {
  save(source: string, data: any, filters?: object): Promise<any>
  find(source: string, filters?: object): Promise<any[]>
  findOne(source: string, filters: object): Promise<any | undefined>
  delete(source: string, filters?: object): Promise<void>
}
