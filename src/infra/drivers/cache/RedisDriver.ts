import { createClient } from 'redis';
import ICacheDriver from './ICacheDriver';
import ILoggerDriver from '../logger/ILoggerDriver';

export default class RedisDriver implements ICacheDriver {
  constructor(
    url: string,
    password: string,
    logger: ILoggerDriver,
    private client = createClient({
      url,
      password,
    }),
  ) {
    this.client.on('connect', () => logger.info('[Redis] Client connected'));
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
    if (!this.client.isReady) return;

    await this.client.set(key, JSON.stringify(data), { EX });
  }

  async get(key: string): Promise<unknown> {
    if (!this.client.isReady) return;

    const data = await this.client.get(key);

    if (!data) return;

    return JSON.parse(data);
  }

  async del(key: string): Promise<void> {
    if (!this.client.isReady) return;

    await this.client.del(key);
  }
}
