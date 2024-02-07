export default interface IDbDriver {
  dbName?: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  createIndex(source: string, column: string, order?: number): Promise<void>;
  create(source: string, data: any, options?: object): Promise<void>;
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
  ): Promise<void>;
  delete(source: string, filters?: object, options?: object): Promise<void>;
  deleteMany(source: string, filters?: object, options?: object): Promise<void>;
}
