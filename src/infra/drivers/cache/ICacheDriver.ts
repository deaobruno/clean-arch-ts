export default interface ICacheDriver {
  set(key: string, data: any, ttl?: number): void;
  get(key: string): any;
  del(key: string): void;
}
