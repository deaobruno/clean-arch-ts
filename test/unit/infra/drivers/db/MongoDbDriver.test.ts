import { faker } from '@faker-js/faker'
import sinon from 'sinon'
import { expect } from "chai";
import config from "../../../../../src/config";
import MongoDbDriver from "../../../../../src/infra/drivers/db/MongoDbDriver";
import IDbDriver from "../../../../../src/infra/drivers/db/IDbDriver";

const {
  db: {
    mongo: { dbUrl },
  },
} = config;
const dbName = "test";
const collectionName = "test";
const data = {
  id: faker.string.uuid(),
  test: "ok",
};


describe("/src/infra/drivers/db/MongoDbDriver.ts", () => {
  let instance: IDbDriver;

  after(async () => {
    await instance.deleteMany(collectionName)
  });

  it("should return a MongoDbDriver instance when there is no previous instance", () => {
    const dbDriver = MongoDbDriver.getInstance(dbUrl, dbName);

    instance = dbDriver;

    expect(dbDriver instanceof MongoDbDriver).equal(true);
  });

  it("should return a MongoDbDriver when there is a previous instance", () => {
    const dbDriver = MongoDbDriver.getInstance(dbUrl, dbName);

    expect(dbDriver).deep.equal(instance);
  });

  it("should connect to a mongoDb server passing db url", async () => {
    const result = await instance.connect();

    expect(result).equal(undefined);
    expect(MongoDbDriver.connected).equal(true);
  });

  it("should return undefined when already connected to a mongoDb server with same db url", async () => {
    const result = await instance.connect();

    expect(result).equal(undefined);
    expect(MongoDbDriver.connected).equal(true);
  });

  it("should disconnect from connected mongoDb server", async () => {
    const result = await instance.disconnect();

    expect(result).equal(undefined);
    expect(MongoDbDriver.connected).equal(false);
  });

  it("should return undefined when no mongoDb server is connected", async () => {
    const result = await instance.disconnect();

    expect(result).equal(undefined);
    expect(MongoDbDriver.connected).equal(false);
  });

  it("should create an index in given collection", async () => {
    await instance.connect()
    const result = await instance.createIndex(collectionName, 'id')
    await instance.disconnect()

    expect(result).equal(undefined)
  })

  it("should get an error when db is not connected when trying to create a document passing collection name and data", async () => {
    const connectStub = sinon.stub(MongoDbDriver.prototype, 'connect').resolves()

    await instance.create(collectionName, data).catch((error) => {
      expect(error.message).equal("MongoDB driver not connected");
    });

    connectStub.restore()
  });

  it("should create a document passing collection name and data", async () => {
    const result = await instance.create(collectionName, data);

    expect(result).equal(undefined);
  });

  it("should return all documents with no filter and passing collection name", async () => {
    const result = await instance.find(collectionName);

    expect(result[0].id).equal(data.id);
    expect(result[0].test).equal(data.test);
    expect(typeof result[0].created_at).equal("string");
  });

  it("should return all documents attending filter and passing collection name", async () => {
    const result = await instance.find(collectionName, { id: data.id });

    expect(result[0].id).equal(data.id);
    expect(result[0].test).equal(data.test);
    expect(typeof result[0].created_at).equal("string");
  });

  it("should return one document passing collection name and attending filter", async () => {
    const result = await instance.findOne(collectionName, { id: data.id });

    expect(result.id).equal(data.id);
    expect(result.test).equal(data.test);
    expect(typeof result.created_at).equal("string");
  });

  it("should update a document passing collection name, data and filter", async () => {
    const result = await instance.update(
      collectionName,
      { test: "updated" },
      { id: data.id }
    );

    expect(result).equal(undefined);
  });

  it("should delete a document passing collection name and filter", async () => {
    const result = await instance.delete(collectionName, { id: data.id });

    expect(result).equal(undefined);
  });

  it("should delete all documents attending filter and passing collection name", async () => {
    await instance.create(collectionName, { id: faker.string.uuid(), test: "ok" });

    const result = await instance.deleteMany(collectionName, { test: "ok" });

    expect(result).equal(undefined);
  });
});
