import { expect } from "chai";
import NodeCacheDriver from "../../../../../src/infra/drivers/cache/NodeCacheDriver";

const nodeCache = new NodeCacheDriver();
const cacheData = { test: "ok" };
const key = "test";

describe("/src/infra/drivers/cache/NodeCacheDriver.ts", () => {
  it("should store data in cache", () => {
    const result = nodeCache.set(key, cacheData);

    expect(result).equal(undefined);
  });

  it("should retrieve data from cache", () => {
    const result = nodeCache.get(key);

    expect(result).deep.equal(cacheData);
  });

  it("should delete data from cache", () => {
    const result = nodeCache.del(key);

    expect(result).equal(undefined);
  });
});
