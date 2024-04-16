export default interface ICacheDriver {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  set(key: string, data: object, ttl?: number): Promise<void>;
  get(key: string): Promise<unknown>;
  del(key: string): Promise<void>;
}
