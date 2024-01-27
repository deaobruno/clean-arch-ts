import sinon from "sinon";
import crypto from "node:crypto";
import { expect } from "chai";
import CryptoDriver from "../../../../../src/infra/drivers/hash/CryptoDriver";

const cryptoDriver = new CryptoDriver();

describe("/infra/drivers/CryptoDriver.ts", () => {
  it("should return an UUID", () => {
    const uuid = "test-test-test-test-test";

    sinon.stub(crypto, "randomUUID").returns(uuid);

    const id = cryptoDriver.generateID();

    expect(id).equal(uuid);
  });

  it("should return a hashed string using sha-256 algorithm and hex encoding", () => {
    const hash = cryptoDriver.hashString("test");

    expect(typeof hash).equal("string");
  });
});
