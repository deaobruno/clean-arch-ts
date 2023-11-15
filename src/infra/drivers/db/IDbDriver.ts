export default interface IDbDriver {
  create(source: string, data: any): Promise<any>;
  find(source: string, filters?: object): Promise<any[]>;
  findOne(source: string, filters: object): Promise<any | undefined>;
  update(source: string, data: any, filters?: object): Promise<any>;
  delete(source: string, filters?: object): Promise<void>;
}
