export default interface IDbDriver<T> {
  dbName?: string;
  connect(client?: unknown): Promise<void>;
  disconnect(): Promise<void>;
  createIndex(source: string, column: string, order?: number): Promise<void>;
  create(source: string, data: unknown, options?: object): Promise<void>;
  find(source: string, filters?: object, options?: object): Promise<T[]>;
  findOne(
    source: string,
    filters: object,
    options?: object,
  ): Promise<T | undefined>;
  update(
    source: string,
    data: unknown,
    filters: object,
    options?: object,
  ): Promise<void>;
  delete(source: string, filters?: object, options?: object): Promise<void>;
  deleteMany(source: string, filters?: object, options?: object): Promise<void>;
}
