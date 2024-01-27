import { expect } from "chai";
import config from "../../../../../src/config";
import MongoDbDriver from "../../../../../src/infra/drivers/db/MongoDbDriver";
import IDbDriver from "../../../../../src/infra/drivers/db/IDbDriver";
import { MongoClient } from "mongodb";

const {
  db: {
    mongo: { dbUrl },
  },
} = config;
const dbName = "test";
const collectionName = "test";
const data = {
  id: 1,
  test: "ok",
};

describe("/src/infra/drivers/db/MongoDbDriver.ts", () => {
  let instance: IDbDriver;

  after(async () => (await MongoClient.connect(dbUrl)).db().dropDatabase());

  it("should return a MongoDbDriver instance when there is no previous instance", () => {
    const dbDriver = MongoDbDriver.getInstance(dbName);

    instance = dbDriver;

    expect(dbDriver instanceof MongoDbDriver).equal(true);
  });

  it("should return a MongoDbDriver when there is a previous instance", () => {
    const dbDriver = MongoDbDriver.getInstance(dbName);

    expect(dbDriver).deep.equal(instance);
  });

  it("should connect to a mongoDb server passing db url", async () => {
    const result = await instance.connect(dbUrl);

    expect(result).equal(undefined);
    expect(MongoDbDriver.connected).equal(true);
  });

  it("should return undefined when already connected to a mongoDb server with same db url", async () => {
    const result = await instance.connect(dbUrl);

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

  it("should create a document passing collection name and data", async () => {
    await instance.create(collectionName, data).catch((error) => {
      expect(error.message).equal("MongoDB driver not connected");
    });
  });

  it("should create a document passing collection name and data", async () => {
    await instance.connect(dbUrl);

    const result = await instance.create(collectionName, data);

    expect(result).equal(undefined);
  });

  it("should return all documents with no filter and passing collection name", async () => {
    await instance.connect(dbUrl);

    const result = await instance.find(collectionName);

    expect(result[0].id).equal(data.id);
    expect(result[0].test).equal(data.test);
    expect(typeof result[0].created_at).equal("string");
  });

  it("should return all documents attending filter and passing collection name", async () => {
    await instance.connect(dbUrl);

    const result = await instance.find(collectionName, { id: data.id });

    expect(result[0].id).equal(data.id);
    expect(result[0].test).equal(data.test);
    expect(typeof result[0].created_at).equal("string");
  });

  it("should return one document passing collection name and attending filter", async () => {
    await instance.connect(dbUrl);

    const result = await instance.findOne(collectionName, { id: data.id });

    expect(result.id).equal(data.id);
    expect(result.test).equal(data.test);
    expect(typeof result.created_at).equal("string");
  });

  it("should update a document passing collection name, data and filter", async () => {
    await instance.connect(dbUrl);

    const result = await instance.update(
      collectionName,
      { test: "updated" },
      { id: data.id }
    );

    expect(result).equal(undefined);
  });

  it("should delete a document passing collection name and filter", async () => {
    await instance.connect(dbUrl);

    const result = await instance.delete(collectionName, { id: data.id });

    expect(result).equal(undefined);
  });

  it("should delete all documents attending filter and passing collection name", async () => {
    await instance.connect(dbUrl);
    await instance.create(collectionName, data);
    await instance.create(collectionName, { id: 2, test: "ok" });

    const result = await instance.deleteMany(collectionName, { test: "ok" });

    expect(result).equal(undefined);
  });
});
