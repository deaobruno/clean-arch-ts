import { createClient } from 'redis'
import ICacheDriver from "./ICacheDriver";
import ILoggerDriver from '../logger/ILoggerDriver';

export default class RedisDriver implements ICacheDriver {
  constructor(url: string, password: string, logger: ILoggerDriver, private client = createClient({
    url,
    password
  })) {
    this.client.on('connect', () => logger.info(`[Redis] Client connected`));
    this.client.on('error', (error) => logger.error(`[Redis] ${error}`));
    this.client.on('end', () => logger.info('[Redis] Client disconnected'));
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async set(key: string, data: object, EX = 900): Promise<void> {
    await this.client.set(key, JSON.stringify(data), { EX });
  }

  async get(key: string): Promise<any> {
    const data = await this.client.get(key)

    if (!data)
      return undefined

    return JSON.parse(data);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}