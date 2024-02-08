import { faker } from '@faker-js/faker'
import { expect } from "chai";
import config from "../../../../../src/config";
import MongoDbDriver from "../../../../../src/infra/drivers/db/MongoDbDriver";
import IDbDriver from "../../../../../src/infra/drivers/db/IDbDriver";
import { MongoClient } from 'mongodb';

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

  it("should connect to a MongoDb server and return a MongoDb Client object", async () => {
    const result = await instance.connect();

    expect(result instanceof MongoClient).equal(true);
  });

  it("should disconnect from connected MongoDb server", async () => {
    const result = await instance.disconnect(await instance.connect());

    expect(result).equal(undefined);
  });

  it("should create an index in given collection", async () => {
    const result = await instance.createIndex(collectionName, 'id')

    expect(result).equal(undefined)
  })

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
