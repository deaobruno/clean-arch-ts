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

export default class MongoDbDriver implements IDbDriver {
  private static instance: IDbDriver;
  private static dbUrl: string;
  private static dbName: string;

  private constructor(dbUrl: string, dbName: string) {
    MongoDbDriver.dbUrl = dbUrl;
    MongoDbDriver.dbName = dbName;
  }

  static getInstance(dbUrl: string, dbName: string): IDbDriver {
    if (!MongoDbDriver.instance)
      MongoDbDriver.instance = new MongoDbDriver(dbUrl, dbName);

    return MongoDbDriver.instance;
  }

  async connect(): Promise<MongoClient> {
    return await MongoClient.connect(MongoDbDriver.dbUrl);
  }

  async disconnect(client: MongoClient): Promise<void> {
    await client.close();
  }

  async createIndex(source: string, column: string, order = 1): Promise<void> {
    const client = await this.connect();
    await MongoDbDriver.getCollection(client, source).createIndex({ [column]: order })
    await this.disconnect(client);
  }

  private static getCollection(client: MongoClient, collectionName: string): Collection {
    return client.db(this.dbName).collection(collectionName);
  }

  private async transact(operation: Function): Promise<void | Document | Document[]> {
    return await this.connect().then(async (client) => {
      const session = client.startSession()
      const result = await session.withTransaction(async () => {
        return await operation(client);
      })

      await session.endSession()
      await this.disconnect(client);

      return result
    })
  }

  async create(
    source: string,
    data: Document,
    options?: InsertOneOptions
  ): Promise<void> {
    await this.transact(async (client: MongoClient) => {
      data.created_at = new Date().toISOString();
      
      await MongoDbDriver.getCollection(client, source).insertOne(data, options);
    })
  }

  async find(
    source: string,
    filters: Filter<Document> = {},
    options: FindOptions = {}
  ): Promise<Document[]> {
    return <Document[]> await this.transact(async (client: MongoClient) => {
      const limit = options.limit ?? 10
  
      options.limit = limit
      options.skip = (options.skip ?? 0) * limit
  
      return await MongoDbDriver.getCollection(client, source).find(filters, options).toArray();
    })
  }

  async findOne(
    source: string,
    filters: Filter<Document>,
    options?: FindOptions
  ): Promise<Document | null> {
    return <Document | null> await this.transact(async (client: MongoClient) => {
      return await MongoDbDriver.getCollection(client, source).findOne(filters, options);
    })
  }

  async update(
    source: string,
    data: UpdateFilter<Document>,
    filters: Filter<Document>,
    options?: any
  ): Promise<void> {
    await this.transact(async (client: MongoClient) => {
      data.updated_at = new Date().toISOString();
  
      await MongoDbDriver.getCollection(client, source).updateOne(
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
    await this.transact(async (client: MongoClient) => {
      await MongoDbDriver.getCollection(client, source).deleteOne(filters, options);
    })
  }

  async deleteMany(
    source: string,
    filters: Filter<Document>,
    options?: DeleteOptions
  ): Promise<void> {
    await this.transact(async (client: MongoClient) => {
      await MongoDbDriver.getCollection(client, source).deleteMany(filters, options);
    })
  }
}
