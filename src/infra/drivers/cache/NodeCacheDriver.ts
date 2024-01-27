import NodeCache from "node-cache";
import ICacheDriver from "./ICacheDriver";

export default class NodeCacheDriver implements ICacheDriver {
  constructor(private cache = new NodeCache()) {}

  set(key: string, data: any, ttl = 0): void {
    this.cache.set(key, data, ttl);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  del(key: string): void {
    this.cache.del(key);
  }
}
