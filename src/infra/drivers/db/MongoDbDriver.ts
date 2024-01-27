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
  private static client: MongoClient;
  private static dbName: string;
  static connected: boolean;

  private constructor(dbName: string) {
    MongoDbDriver.dbName = dbName;
  }

  static getInstance(dbName: string): IDbDriver {
    if (!MongoDbDriver.instance)
      MongoDbDriver.instance = new MongoDbDriver(dbName);

    return MongoDbDriver.instance;
  }

  async connect(url: string): Promise<void> {
    if (!MongoDbDriver.connected) {
      MongoDbDriver.client = await MongoClient.connect(url);
      MongoDbDriver.connected = true;
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

  async create(
    source: string,
    data: Document,
    options?: InsertOneOptions
  ): Promise<void> {
    data.created_at = new Date().toISOString();

    await MongoDbDriver.getCollection(source).insertOne(data, options);
  }

  async find(
    source: string,
    filters: Filter<Document> = {},
    options?: FindOptions
  ): Promise<Document[]> {
    return MongoDbDriver.getCollection(source).find(filters, options).toArray();
  }

  async findOne(
    source: string,
    filters: Filter<Document>,
    options?: FindOptions
  ): Promise<Document | null> {
    return MongoDbDriver.getCollection(source).findOne(filters, options);
  }

  async update(
    source: string,
    data: UpdateFilter<Document>,
    filters: Filter<Document>,
    options?: any
  ): Promise<void> {
    data.updated_at = new Date().toISOString();

    await MongoDbDriver.getCollection(source).updateOne(
      filters,
      { $set: data },
      options
    );
  }

  async delete(
    source: string,
    filters: Filter<Document>,
    options?: DeleteOptions
  ): Promise<void> {
    await MongoDbDriver.getCollection(source).deleteOne(filters, options);
  }

  async deleteMany(
    source: string,
    filters: Filter<Document>,
    options?: DeleteOptions
  ): Promise<void> {
    await MongoDbDriver.getCollection(source).deleteMany(filters, options);
  }
}
