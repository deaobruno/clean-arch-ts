import { faker } from '@faker-js/faker';
import sinon from 'sinon';
import { expect } from 'chai';
import config from '../../../../../src/config';
import MongoDbDriver from '../../../../../src/infra/drivers/db/MongoDbDriver';
import {
  ClientSession,
  Collection,
  Db,
  FindCursor,
  ListIndexesCursor,
  MongoClient,
} from 'mongodb';
import EventEmitter from 'events';

const sandbox = sinon.createSandbox();
const { dbUrl } = config.db.mongo;
const dbName = 'test';
const collectionName = 'test';
const data = {
  id: faker.string.uuid(),
  test: 'ok',
};

class CustomClient extends EventEmitter {
  constructor() {
    super();
  }

  async close(): Promise<void> {
    this.emit('error', 'Test');
  }
}

describe('/src/infra/drivers/db/MongoDbDriver.ts', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeEach(() => (MongoDbDriver['instance'] = <any>undefined));

  afterEach(() => sandbox.restore());

  it('should return a MongoDbDriver instance when there is no previous instance', () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const mongoDbClient = sandbox.createStubInstance(MongoClient);
    const mongoDb = sandbox.createStubInstance(Db);
    const mongoDbSession = sandbox.createStubInstance(ClientSession);
    const mongoDbCollection = sandbox.createStubInstance(Collection);

    mongoDbClient.db.returns(mongoDb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.withTransaction = <any>(
      ClientSession.prototype.withTransaction
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.transaction = <any>sandbox.stub();
    mongoDbSession.commitTransaction.resolves();
    mongoDbClient.startSession.returns(mongoDbSession);
    mongoDb.collection.returns(mongoDbCollection);

    const dbDriver = MongoDbDriver.getInstance(dbUrl, dbName, logger);

    expect(dbDriver instanceof MongoDbDriver).equal(true);
  });

  it('should return a MongoDbDriver when there is a previous instance', () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const mongoDbClient = sandbox.createStubInstance(MongoClient);
    const mongoDb = sandbox.createStubInstance(Db);
    const mongoDbSession = sandbox.createStubInstance(ClientSession);
    const mongoDbCollection = sandbox.createStubInstance(Collection);

    mongoDbClient.db.returns(mongoDb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.withTransaction = <any>(
      ClientSession.prototype.withTransaction
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.transaction = <any>sandbox.stub();
    mongoDbSession.commitTransaction.resolves();
    mongoDbClient.startSession.returns(mongoDbSession);
    mongoDb.collection.returns(mongoDbCollection);

    const dbDriver = MongoDbDriver.getInstance(dbUrl, dbName, logger);
    const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

    expect(instance).deep.equal(dbDriver);
  });

  it('should connect to a mongoDb server', async () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const mongoDbClient = sandbox.createStubInstance(MongoClient);
    const mongoDb = sandbox.createStubInstance(Db);
    const mongoDbSession = sandbox.createStubInstance(ClientSession);
    const mongoDbCollection = sandbox.createStubInstance(Collection);

    mongoDbClient.db.returns(mongoDb);
    mongoDbClient.on.returns(mongoDbClient);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.withTransaction = <any>(
      ClientSession.prototype.withTransaction
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.transaction = <any>sandbox.stub();
    mongoDbSession.commitTransaction.resolves();
    mongoDbClient.startSession.returns(mongoDbSession);
    mongoDb.collection.returns(mongoDbCollection);

    const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);
    const result = await instance.connect(mongoDbClient);

    expect(result).equal(undefined);
    expect(MongoDbDriver.connected).equal(true);
  });

  it('should return undefined when already connected to a mongoDb server with same db url', async () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const mongoDbClient = sandbox.createStubInstance(MongoClient);
    const mongoDb = sandbox.createStubInstance(Db);
    const mongoDbSession = sandbox.createStubInstance(ClientSession);
    const mongoDbCollection = sandbox.createStubInstance(Collection);

    mongoDbClient.db.returns(mongoDb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.withTransaction = <any>(
      ClientSession.prototype.withTransaction
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.transaction = <any>sandbox.stub();
    mongoDbSession.commitTransaction.resolves();
    mongoDbClient.startSession.returns(mongoDbSession);
    mongoDb.collection.returns(mongoDbCollection);

    const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);
    const result = await instance.connect(mongoDbClient);

    expect(result).equal(undefined);
    expect(MongoDbDriver.connected).equal(true);
  });

  it('should disconnect from connected mongoDb server', async () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const mongoDbClient = sandbox.createStubInstance(MongoClient);
    const mongoDb = sandbox.createStubInstance(Db);
    const mongoDbSession = sandbox.createStubInstance(ClientSession);
    const mongoDbCollection = sandbox.createStubInstance(Collection);

    mongoDbClient.db.returns(mongoDb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.withTransaction = <any>(
      ClientSession.prototype.withTransaction
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.transaction = <any>sandbox.stub();
    mongoDbSession.commitTransaction.resolves();
    mongoDbClient.startSession.returns(mongoDbSession);
    mongoDb.collection.returns(mongoDbCollection);

    const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);
    const result = await instance.disconnect();

    expect(result).equal(undefined);
    expect(MongoDbDriver.connected).equal(false);
  });

  it('should return undefined when no mongoDb server is connected', async () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const mongoDbClient = sandbox.createStubInstance(MongoClient);
    const mongoDb = sandbox.createStubInstance(Db);
    const mongoDbSession = sandbox.createStubInstance(ClientSession);
    const mongoDbCollection = sandbox.createStubInstance(Collection);

    mongoDbClient.db.returns(mongoDb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.withTransaction = <any>(
      ClientSession.prototype.withTransaction
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mongoDbSession.transaction = <any>sandbox.stub();
    mongoDbSession.commitTransaction.resolves();
    mongoDbClient.startSession.returns(mongoDbSession);
    mongoDb.collection.returns(mongoDbCollection);

    const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);
    const result = await instance.disconnect();

    expect(result).equal(undefined);
    expect(MongoDbDriver.connected).equal(false);
  });

  it('should create a collection', async () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const mongoDbClient = sandbox.createStubInstance(MongoClient);
    const mongoDb = sandbox.createStubInstance(Db);

    mongoDbClient.db.returns(mongoDb);

    MongoDbDriver['client'] = mongoDbClient;

    const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);
    const result = await instance.createCollection('test');

    expect(result).equal(undefined);
  });

  it('should log a message after starting client connection', async () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const dbDriver = MongoDbDriver.getInstance(dbUrl, dbName, logger);

    await dbDriver.connect();

    expect(
      logger.info.calledOnceWith('[MongoDbDriver] Client connected'),
    ).equal(true);

    await dbDriver.disconnect();
  });

  it('should log a message after client throws an error', async () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const dbDriver = MongoDbDriver.getInstance(dbUrl, dbName, logger);
    const client = new CustomClient();

    await dbDriver.connect(client);
    await dbDriver.disconnect();

    expect(logger.error.calledOnceWith(`[MongoDbDriver] Error: Test`)).equal(
      true,
    );
  });

  it('should log a message after ending client connection', async () => {
    const logger = {
      obfuscate: sandbox.stub(),
      obfuscateData: sandbox.stub(),
      debug: sandbox.stub(),
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      fatal: sandbox.stub(),
    };
    const dbDriver = MongoDbDriver.getInstance(dbUrl, dbName, logger);

    await dbDriver.connect();
    await dbDriver.disconnect();

    expect(
      logger.fatal.calledOnceWith('[MongoDbDriver] Client disconnected'),
    ).equal(true);
  });

  describe('I/O methods', () => {
    it('should not create an index when it already exists in given collection', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const cursor = sandbox.createStubInstance(ListIndexesCursor);
      const mongoDbCollection = sandbox.createStubInstance(Collection);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      cursor.toArray.resolves([{ key: { id: 1 } }]);
      mongoDbCollection.listIndexes.returns(cursor);
      mongoDb.collection.returns(mongoDbCollection);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      const result = await instance.createIndex(collectionName, 'id');

      await instance.disconnect();

      expect(result).equal(undefined);
      expect(mongoDbCollection.createIndex.notCalled).equal(true);
    });

    it('should create an index in given collection', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const cursor = sandbox.createStubInstance(ListIndexesCursor);
      const mongoDbCollection = sandbox.createStubInstance(Collection);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      cursor.toArray.resolves([]);
      mongoDbCollection.listIndexes.returns(cursor);
      mongoDb.collection.returns(mongoDbCollection);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      const result = await instance.createIndex(collectionName, 'id');

      await instance.disconnect();

      expect(result).equal(undefined);
      expect(mongoDbCollection.createIndex.calledOnceWith({ id: 1 })).equal(
        true,
      );
    });

    it('should get an error when db is not connected when trying to create a document passing collection name and data', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance
        .createIndex(collectionName, 'test')
        .catch(async (error) => {
          expect(error.message).equal('MongoDB driver not connected');
        });
    });

    it('should create a document passing collection name and data', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const mongoDbCollection = sandbox.createStubInstance(Collection);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      mongoDb.collection.returns(mongoDbCollection);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      const result = await instance.create(collectionName, data);

      await instance.disconnect();

      expect(result).equal(undefined);
      expect(mongoDbCollection.insertOne.calledOnce).equal(true);
    });

    it('should return all documents with no filter and passing collection name', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const mongoDbCollection = sandbox.createStubInstance(Collection);
      const mongoDbCursor = sandbox.createStubInstance(FindCursor);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      mongoDb.collection.returns(mongoDbCollection);

      mongoDbCursor.toArray.resolves([data]);
      mongoDbCollection.find.returns(mongoDbCursor);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = <any>await instance.find(collectionName);

      await instance.disconnect();

      expect(result[0].id).equal(data.id);
      expect(result[0].test).equal(data.test);
      expect(typeof result[0].created_at).equal('string');
      expect(
        mongoDbCollection.find.calledOnceWith({}, { limit: 10, skip: 0 }),
      ).equal(true);
    });

    it('should return all documents attending filter and passing collection name', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const mongoDbCollection = sandbox.createStubInstance(Collection);
      const mongoDbCursor = sandbox.createStubInstance(FindCursor);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      mongoDb.collection.returns(mongoDbCollection);
      mongoDbCursor.toArray.resolves([data]);
      mongoDbCollection.find.returns(mongoDbCursor);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      const filter = { id: data.id };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = <any>await instance.find(collectionName, filter);

      await instance.disconnect();

      expect(result[0].id).equal(data.id);
      expect(result[0].test).equal(data.test);
      expect(typeof result[0].created_at).equal('string');
      expect(
        mongoDbCollection.find.calledOnceWith(filter, { limit: 10, skip: 0 }),
      ).equal(true);
    });

    it('should return an empty array when no documents are found', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const mongoDbCollection = sandbox.createStubInstance(Collection);
      const mongoDbCursor = sandbox.createStubInstance(FindCursor);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      mongoDb.collection.returns(mongoDbCollection);

      mongoDbCursor.toArray.resolves([]);
      mongoDbCollection.find.returns(mongoDbCursor);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = <any>await instance.find(collectionName);

      await instance.disconnect();

      expect(result).deep.equal([]);
      expect(
        mongoDbCollection.find.calledOnceWith({}, { limit: 10, skip: 0 }),
      ).equal(true);
    });

    it('should return one document passing collection name and attending filter', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const mongoDbCollection = sandbox.createStubInstance(Collection);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      mongoDb.collection.returns(mongoDbCollection);
      mongoDbCollection.findOne.resolves(data);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      const filter = { id: data.id };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = <any>await instance.findOne(collectionName, filter);

      await instance.disconnect();

      expect(result.id).equal(data.id);
      expect(result.test).equal(data.test);
      expect(typeof result.created_at).equal('string');
      expect(mongoDbCollection.findOne.calledOnceWith(filter)).equal(true);
    });

    it('should return undefined when no document is found', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const mongoDbCollection = sandbox.createStubInstance(Collection);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      mongoDb.collection.returns(mongoDbCollection);
      mongoDbCollection.findOne.resolves();

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      const filter = { id: data.id };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = <any>await instance.findOne(collectionName, filter);

      await instance.disconnect();

      expect(result).equal(undefined);
      expect(mongoDbCollection.findOne.calledOnceWith(filter)).equal(true);
    });

    it('should update a document passing collection name, data and filter', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const mongoDbCollection = sandbox.createStubInstance(Collection);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      mongoDb.collection.returns(mongoDbCollection);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      const filter = { id: data.id };
      const updateData = { test: 'updated' };
      const result = await instance.update(collectionName, updateData, filter);

      await instance.disconnect();

      expect(result).equal(undefined);
      expect(mongoDbCollection.updateOne.calledOnce).equal(true);
    });

    it('should delete a document passing collection name and filter', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const mongoDbCollection = sandbox.createStubInstance(Collection);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      mongoDb.collection.returns(mongoDbCollection);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      const filter = { id: data.id };
      const result = await instance.delete(collectionName, filter);

      await instance.disconnect();

      expect(result).equal(undefined);
      expect(mongoDbCollection.deleteOne.calledOnceWith(filter)).equal(true);
    });

    it('should delete all documents attending filter and passing collection name', async () => {
      const logger = {
        obfuscate: sandbox.stub(),
        obfuscateData: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        fatal: sandbox.stub(),
      };
      const mongoDbClient = sandbox.createStubInstance(MongoClient);
      const mongoDb = sandbox.createStubInstance(Db);
      const mongoDbSession = sandbox.createStubInstance(ClientSession);
      const mongoDbCollection = sandbox.createStubInstance(Collection);

      mongoDbClient.db.returns(mongoDb);
      mongoDbClient.on.returns(mongoDbClient);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.withTransaction = <any>(
        ClientSession.prototype.withTransaction
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mongoDbSession.transaction = <any>sandbox.stub();
      mongoDbSession.commitTransaction.resolves();
      mongoDbClient.startSession.returns(mongoDbSession);
      mongoDb.collection.returns(mongoDbCollection);

      const instance = MongoDbDriver.getInstance(dbUrl, dbName, logger);

      await instance.connect(mongoDbClient);

      const filter = { test: 'ok' };
      const result = await instance.deleteMany(collectionName, filter);

      await instance.disconnect();

      expect(result).equal(undefined);
      expect(mongoDbCollection.deleteMany.calledOnceWith(filter)).equal(true);
    });
  });
});
