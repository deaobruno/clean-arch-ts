export default interface ICacheDriver {
  connect(): Promise<void>
  disconnect(): Promise<void>
  set(key: string, data: any, ttl?: number): Promise<void>;
  get(key: string): Promise<any>;
  del(key: string): Promise<void>;
}
