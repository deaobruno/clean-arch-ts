import sinon from "sinon";
import axios from "axios";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import config from "../../../src/config";
import UserRole from "../../../src/domain/user/UserRole";
import CryptoDriver from "../../../src/infra/drivers/hash/CryptoDriver";
import server from "../../../src/infra/http/v1/server";
import MongoDbDriver from "../../../src/infra/drivers/db/MongoDbDriver";
import JwtDriver from "../../../src/infra/drivers/token/JwtDriver";
import { MongoClient } from "mongodb";

const {
  db: {
    mongo: { dbUrl },
  },
} = config;
const sandbox = sinon.createSandbox();
const dbDriver = MongoDbDriver.getInstance(dbUrl, "test");
const hashDriver = new CryptoDriver();
const url = "http://localhost:8080/api/v1/memos";
const memoId = faker.string.uuid();
const email = faker.internet.email();
const password = faker.internet.password();
const role = UserRole.ROOT;
const Authorization = "Bearer token";
const token = "refresh-token";

describe("GET /memos/:memo_id", () => {
  let client: MongoClient

  before(async () => {
    client = await dbDriver.connect();

    server.start(8080);
  });

  afterEach(() => sandbox.restore());

  after(async () => {
    await dbDriver.disconnect(client);

    server.stop();
  });

  it("should get 200 status code and an object with a single memo data when trying to find a memo by memo_id", async () => {
    const userId = faker.string.uuid();
    const title = "New Title";
    const text = "Lorem ipsum";
    const start = new Date(new Date().getTime() + 3.6e6).toISOString();
    const end = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox
      .stub(dbDriver, "findOne")
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      })
      .onCall(2)
      .resolves({
        memo_id: memoId,
        user_id: userId,
        title,
        text,
        start,
        end,
      });

    const { status, data } = await axios.get(`${url}/${memoId}`, {
      headers: { Authorization, "Content-Type": "application/json" },
    });

    expect(status).equal(200);
    expect(data.id).equal(memoId);
    expect(data.title).equal(title);
    expect(data.text).equal(text);
    expect(data.start).equal(start);
    expect(data.end).equal(end);
  });

  it("should get 400 status code when trying to find a memo passing invalid memo_id", async () => {
    const userId = faker.string.uuid();

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox
      .stub(dbDriver, "findOne")
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      });

    await axios
      .get(`${url}/test`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(400);
        expect(data.error).equal('Invalid "memo_id" format');
      });
  });

  it("should get 404 status code when memo is not found", async () => {
    const userId = faker.string.uuid();

    sandbox
      .stub(JwtDriver.prototype, "validateAccessToken")
      .returns({ id: userId });
    sandbox
      .stub(dbDriver, "findOne")
      .onCall(0)
      .resolves({
        user_id: userId,
        token,
      })
      .onCall(1)
      .resolves({
        user_id: userId,
        email,
        password: hashDriver.hashString(password),
        role,
      })
      .onCall(2)
      .resolves();

    await axios
      .get(`${url}/${memoId}`, { headers: { Authorization } })
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404);
        expect(data.error).equal("Memo not found");
      });
  });
});
