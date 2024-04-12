import {
  Collection,
  DeleteOptions,
  Document,
  Filter,
  FindOptions,
  InsertOneOptions,
  MongoClient,
  UpdateFilter,
} from "mongodb";
import IDbDriver from "./IDbDriver";
import ILoggerDriver from "../logger/ILoggerDriver";

export default class MongoDbDriver implements IDbDriver {
  private static instance: IDbDriver;
  private static client: MongoClient;
  private static dbUrl: string;
  private static dbName: string;
  static connected: boolean;

  private constructor(dbUrl: string, dbName: string, private logger: ILoggerDriver) {
    MongoDbDriver.dbUrl = dbUrl;
    MongoDbDriver.dbName = dbName;
  }

  static getInstance(dbUrl: string, dbName: string, logger: ILoggerDriver): IDbDriver {
    if (!MongoDbDriver.instance)
      MongoDbDriver.instance = new MongoDbDriver(dbUrl, dbName, logger);

    return MongoDbDriver.instance;
  }

  async connect(client?: MongoClient): Promise<void> {
    if (!MongoDbDriver.connected) {
      MongoDbDriver.client = client ?? await MongoClient.connect(MongoDbDriver.dbUrl);
      MongoDbDriver.connected = true;

      this.logger.info('[MongoDb] Client connected')

      MongoDbDriver.client.on('serverClosed', () => {
        this.logger.info('[MongoDb] Client disconnected')
      })

      MongoDbDriver.client.on('error', (error) => {
        this.logger.error(`[MongoDb] Error: ${error}`)
      })
    }
  }

  async disconnect(): Promise<void> {
    if (MongoDbDriver.connected) {
      await MongoDbDriver.client.close();

      MongoDbDriver.connected = false;
    }
  }

  private static getCollection(collectionName: string): Collection {
    if (!this.connected) throw new Error("MongoDB driver not connected");

    return this.client.db(this.dbName).collection(collectionName);
  }

  private async transact(operation: Function): Promise<void | Document | Document[]> {
    const session = MongoDbDriver.client.startSession()

    try {
      return await session.withTransaction(async () => {
        return await operation()
      })
    } finally {
      if (session)
        await session.endSession()
    }
  }

  async createIndex(source: string, column: string, order = 1): Promise<void> {
    await MongoDbDriver.getCollection(source).createIndex({ [column]: order })
  }

  async create(
    source: string,
    data: Document,
    options?: InsertOneOptions
  ): Promise<void> {
    await this.transact(async () => {
      data.created_at = new Date().toISOString();

      await MongoDbDriver.getCollection(source).insertOne(data, options);
    })
  }

  async find(
    source: string,
    filters: Filter<Document> = {},
    options: FindOptions = {}
  ): Promise<Document[]> {
    return <Document[]> await this.transact(async () => {
      const limit = options.limit ?? 10

      options.limit = limit
      options.skip = (options.skip ?? 0) * limit

      return await MongoDbDriver.getCollection(source).find(filters, options).toArray();
    })
  }

  async findOne(
    source: string,
    filters: Filter<Document>,
    options?: FindOptions
  ): Promise<Document | null> {
    return <Document | null> await this.transact(async () => {
      return await MongoDbDriver.getCollection(source).findOne(filters, options);
    })
  }

  async update(
    source: string,
    data: UpdateFilter<Document>,
    filters: Filter<Document>,
    options?: any
  ): Promise<void> {
    await this.transact(async () => {
      data.updated_at = new Date().toISOString();

      await MongoDbDriver.getCollection(source).updateOne(
        filters,
        { $set: data },
        options
      );
    })
  }

  async delete(
    source: string,
    filters: Filter<Document>,
    options?: DeleteOptions
  ): Promise<void> {
    await this.transact(async () => {
      await MongoDbDriver.getCollection(source).deleteOne(filters, options);
    })
  }

  async deleteMany(
    source: string,
    filters: Filter<Document>,
    options?: DeleteOptions
  ): Promise<void> {
    await this.transact(async () => {
      await MongoDbDriver.getCollection(source).deleteMany(filters, options);
    })
  }
}
