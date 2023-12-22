export default interface IDbDriver {
  dbName?: string;
  connect(url: string): Promise<void>;
  disconnect(): Promise<void>;
  create(source: string, data: any, options?: object): Promise<any>;
  find(source: string, filters?: object, options?: object): Promise<any[]>;
  findOne(
    source: string,
    filters: object,
    options?: object
  ): Promise<any | undefined>;
  update(
    source: string,
    data: any,
    filters: object,
    options?: object
  ): Promise<any>;
  delete(source: string, filters?: object, options?: object): Promise<void>;
  deleteMany(source: string, filters?: object, options?: object): Promise<void>;
}
