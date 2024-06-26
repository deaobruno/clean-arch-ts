import {
  Collection,
  DeleteOptions,
  Document,
  Filter,
  FindOptions,
  InsertOneOptions,
  MongoClient,
  UpdateFilter,
  UpdateOptions,
} from 'mongodb';
import IDbDriver from './IDbDriver';
import ILoggerDriver from '../logger/ILoggerDriver';

type DbResponse = void | null | Document | Document[];
type Operation = () => Promise<DbResponse>;

export default class MongoDbDriver implements IDbDriver<unknown> {
  private static instance: IDbDriver<unknown>;
  private static client: MongoClient;
  private static dbUrl: string;
  private static dbName: string;
  static connected: boolean;

  private constructor(
    dbUrl: string,
    dbName: string,
    private logger: ILoggerDriver,
  ) {
    MongoDbDriver.dbUrl = dbUrl;
    MongoDbDriver.dbName = dbName;
  }

  static getInstance(
    dbUrl: string,
    dbName: string,
    logger: ILoggerDriver,
  ): IDbDriver<unknown> {
    if (!MongoDbDriver.instance)
      MongoDbDriver.instance = new MongoDbDriver(dbUrl, dbName, logger);

    return MongoDbDriver.instance;
  }

  async connect(client?: MongoClient): Promise<void> {
    if (!MongoDbDriver.connected) {
      MongoDbDriver.client =
        client ?? (await MongoClient.connect(MongoDbDriver.dbUrl));
      MongoDbDriver.connected = true;

      this.logger.info('[MongoDbDriver] Client connected');

      MongoDbDriver.client
        .on('serverClosed', () => {
          this.logger.fatal('[MongoDbDriver] Client disconnected');
        })
        .on('error', (error) => {
          this.logger.error(`[MongoDbDriver] Error: ${error}`);
        });
    }
  }

  async disconnect(): Promise<void> {
    if (MongoDbDriver.connected === true) {
      await MongoDbDriver.client.close();

      MongoDbDriver.connected = false;
    }
  }

  async createCollection(collectionName: string): Promise<void> {
    await MongoDbDriver.client
      .db(MongoDbDriver.dbName)
      .createCollection(collectionName);
  }

  private getCollection(collectionName: string): Collection {
    if (!MongoDbDriver.connected)
      throw new Error('MongoDB driver not connected');

    return MongoDbDriver.client
      .db(MongoDbDriver.dbName)
      .collection(collectionName);
  }

  private async transact(operation: Operation): Promise<DbResponse> {
    const session = MongoDbDriver.client.startSession();

    try {
      return session.withTransaction(async () => await operation());
    } finally {
      await session.endSession();
    }
  }

  async createIndex(source: string, column: string, order = 1): Promise<void> {
    const collection = this.getCollection(source);
    const newIndex = { [column]: order };
    const indexes = await collection.listIndexes().toArray();
    const exists = indexes.filter(
      (index) => JSON.stringify(index.key) === JSON.stringify(newIndex),
    )[0];

    if (exists) {
      this.logger.debug({
        message: '[MongoDbDriver] Index already exists',
        source,
        column,
        order,
      });

      return;
    }

    await collection.createIndex(newIndex);

    this.logger.debug({
      message: '[MongoDbDriver] Index created',
      source,
      column,
      order,
    });
  }

  async create(
    source: string,
    data: Document,
    options?: InsertOneOptions,
  ): Promise<void> {
    await this.transact(async () => {
      data.created_at = new Date().toISOString();

      await this.getCollection(source).insertOne(data, options);

      this.logger.debug({
        message: '[MongoDbDriver] Document created',
        source,
        data,
        options,
      });
    });
  }

  async find(
    source: string,
    filters: Filter<Document> = {},
    options: FindOptions = {},
  ): Promise<Document[]> {
    return <Document[]>await this.transact(async () => {
      const limit = options.limit ?? 10;

      options.limit = limit;
      options.skip = (options.skip ?? 0) * limit;

      const documents = await this.getCollection(source)
        .find(filters, options)
        .toArray();

      this.logger.debug({
        message:
          documents.length > 0
            ? '[MongoDbDriver] Document(s) found'
            : '[MongoDbDriver] Documents not found',
        source,
        filters,
        options,
        documents,
      });

      return documents;
    });
  }

  async findOne(
    source: string,
    filters: Filter<Document>,
    options?: FindOptions,
  ): Promise<Document | undefined> {
    return <Document | undefined>await this.transact(async () => {
      const document = await this.getCollection(source).findOne(
        filters,
        options,
      );

      this.logger.debug({
        message: document
          ? '[MongoDbDriver] Document found'
          : '[MongoDbDriver] Document not found',
        source,
        filters,
        options,
        document,
      });

      return document;
    });
  }

  async update(
    source: string,
    data: UpdateFilter<Document>,
    filters: Filter<Document>,
    options?: UpdateOptions,
  ): Promise<void> {
    await this.transact(async () => {
      data.updated_at = new Date().toISOString();

      await this.getCollection(source).updateOne(
        filters,
        { $set: data },
        options,
      );

      this.logger.debug({
        message: '[MongoDbDriver] Document updated',
        source,
        data,
        filters,
        options,
      });
    });
  }

  async delete(
    source: string,
    filters: Filter<Document>,
    options?: DeleteOptions,
  ): Promise<void> {
    await this.transact(async () => {
      await this.getCollection(source).deleteOne(filters, options);

      this.logger.debug({
        message: '[MongoDbDriver] Document deleted',
        source,
        filters,
        options,
      });
    });
  }

  async deleteMany(
    source: string,
    filters: Filter<Document>,
    options?: DeleteOptions,
  ): Promise<void> {
    await this.transact(async () => {
      await this.getCollection(source).deleteMany(filters, options);

      this.logger.debug({
        message: '[MongoDbDriver] Documents deleted',
        source,
        filters,
        options,
      });
    });
  }
}
