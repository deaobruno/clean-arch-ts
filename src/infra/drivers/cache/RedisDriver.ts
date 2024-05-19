import { createClient } from 'redis';
import ICacheDriver from './ICacheDriver';
import ILoggerDriver from '../logger/ILoggerDriver';

export default class RedisDriver implements ICacheDriver {
  constructor(
    url: string,
    password: string,
    private logger: ILoggerDriver,
    private client = createClient({
      url,
      password,
    }),
  ) {
    this.client.on('connect', () =>
      this.logger.info('[RedisDriver] Client connected'),
    );
    this.client.on('error', (error) =>
      this.logger.error(`[RedisDriver] ${error}`),
    );
    this.client.on('end', () =>
      this.logger.error('[RedisDriver] Client disconnected'),
    );
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async set(key: string, data: object, EX = 900): Promise<void> {
    if (!this.client.isReady) {
      this.logger.debug({
        message: '[RedisDriver] Client not ready',
        client: this.client,
      });

      return;
    }

    await this.client.set(key, JSON.stringify(data), { EX });

    this.logger.debug({
      message: '[RedisDriver] New key created',
      key,
      data,
      ttl: EX,
    });
  }

  async get(key: string): Promise<unknown> {
    if (!this.client.isReady) {
      this.logger.debug({
        message: '[RedisDriver] Client not ready',
        client: this.client,
      });

      return;
    }

    const data = await this.client.get(key);

    if (!data) {
      this.logger.debug({
        message: '[RedisDriver] Key not found',
        key,
      });

      return;
    }

    const parsedData = JSON.parse(data);

    this.logger.debug({
      message: '[RedisDriver] Key found',
      key,
      data: parsedData,
    });

    return parsedData;
  }

  async del(key: string): Promise<void> {
    if (!this.client.isReady) {
      this.logger.debug({
        message: '[RedisDriver] Client not ready',
        client: this.client,
      });

      return;
    }

    await this.client.del(key);

    this.logger.debug({
      message: '[RedisDriver] Key deleted',
      key,
    });
  }
}
