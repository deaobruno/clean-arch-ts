import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import config from "../../../../src/config";
import RefreshTokenRepository from "../../../../src/adapters/repositories/RefreshTokenRepository";
import MongoDbDriver from "../../../../src/infra/drivers/db/MongoDbDriver";
import NodeCacheDriver from "../../../../src/infra/drivers/cache/NodeCacheDriver";
import IDbDriver from "../../../../src/infra/drivers/db/IDbDriver";
import IRefreshTokenRepository from "../../../../src/domain/refreshToken/IRefreshTokenRepository";
import RefreshTokenMapper from "../../../../src/domain/refreshToken/RefreshTokenMapper";
import RefreshToken from "../../../../src/domain/refreshToken/RefreshToken";
import ICacheDriver from "../../../../src/infra/drivers/cache/ICacheDriver";

const sandbox = sinon.createSandbox();
let dbDriver: IDbDriver;
let cacheDriver: ICacheDriver;
let refreshTokenMapper: RefreshTokenMapper;
let refreshTokenRepository: IRefreshTokenRepository;

describe("/adapters/repositories/RefreshTokenRepository", () => {
  beforeEach(() => {
    dbDriver = MongoDbDriver.getInstance("test");
    cacheDriver = sandbox.createStubInstance(NodeCacheDriver);
    refreshTokenMapper = new RefreshTokenMapper();
    refreshTokenRepository = new RefreshTokenRepository(
      config.db.refreshTokensSource,
      dbDriver,
      cacheDriver,
      refreshTokenMapper,
      config.app.refreshTokenExpirationTime
    );
  });

  afterEach(() => sandbox.restore());

  it("should save a RefreshToken entity in DB", async () => {
    const userId = faker.string.uuid();
    const token = "refresh-token";
    const fakeRefreshToken = { userId, token };

    sandbox.stub(RefreshToken, "create").returns({
      userId,
      token,
    });
    sandbox.stub(refreshTokenMapper, "entityToDb").returns({
      user_id: userId,
      token,
    });
    sandbox.stub(MongoDbDriver.prototype, "create").resolves();

    const result = await refreshTokenRepository.create(fakeRefreshToken);

    expect(result).equal(undefined);
  });

  it("should return all RefreshTokens from DB when no filter is passed", async () => {
    const dbRefreshTokens = [
      {
        user_id: faker.string.uuid(),
        token: "refresh-token-1",
      },
      {
        user_id: faker.string.uuid(),
        token: "refresh-token-2",
      },
      {
        user_id: faker.string.uuid(),
        token: "refresh-token-3",
      },
    ];

    sandbox.stub(MongoDbDriver.prototype, "find").resolves(dbRefreshTokens);
    sandbox
      .stub(refreshTokenMapper, "dbToEntity")
      .withArgs(dbRefreshTokens[0])
      .returns({
        userId: dbRefreshTokens[0].user_id,
        token: dbRefreshTokens[0].token,
      })
      .withArgs(dbRefreshTokens[1])
      .returns({
        userId: dbRefreshTokens[1].user_id,
        token: dbRefreshTokens[1].token,
      })
      .withArgs(dbRefreshTokens[2])
      .returns({
        userId: dbRefreshTokens[2].user_id,
        token: dbRefreshTokens[2].token,
      });

    const refreshTokens = await refreshTokenRepository.find();

    expect(refreshTokens[0].userId).equal(dbRefreshTokens[0].user_id);
    expect(refreshTokens[0].token).equal(dbRefreshTokens[0].token);
    expect(refreshTokens[1].userId).equal(dbRefreshTokens[1].user_id);
    expect(refreshTokens[1].token).equal(dbRefreshTokens[1].token);
    expect(refreshTokens[2].userId).equal(dbRefreshTokens[2].user_id);
    expect(refreshTokens[2].token).equal(dbRefreshTokens[2].token);
  });

  it("should return filtered RefreshTokens from DB when some filter is passed", async () => {
    const userId = faker.string.uuid();
    const dbRefreshTokens = [
      {
        user_id: userId,
        token: "refresh-token-1",
      },
      {
        user_id: userId,
        token: "refresh-token-2",
      },
    ];

    sandbox.stub(MongoDbDriver.prototype, "find").resolves(dbRefreshTokens);
    sandbox
      .stub(refreshTokenMapper, "dbToEntity")
      .withArgs(dbRefreshTokens[0])
      .returns({
        userId: dbRefreshTokens[0].user_id,
        token: dbRefreshTokens[0].token,
      })
      .withArgs(dbRefreshTokens[1])
      .returns({
        userId: dbRefreshTokens[1].user_id,
        token: dbRefreshTokens[1].token,
      });

    const refreshTokens = await refreshTokenRepository.find({
      user_id: userId,
    });

    expect(refreshTokens[0].userId).equal(dbRefreshTokens[0].user_id);
    expect(refreshTokens[0].token).equal(dbRefreshTokens[0].token);
    expect(refreshTokens[1].userId).equal(dbRefreshTokens[1].user_id);
    expect(refreshTokens[1].token).equal(dbRefreshTokens[1].token);
  });

  it("should return an empty array when no RefreshTokens are found", async () => {
    const dbRefreshTokens: any[] = [];

    sandbox.stub(MongoDbDriver.prototype, "find").resolves(dbRefreshTokens);

    const refreshTokens = await refreshTokenRepository.find();

    expect(refreshTokens.length).equal(0);
  });

  it("should return a RefreshToken from DB when some filter is passed", async () => {
    const userId = faker.string.uuid();
    const token = "refresh-token";

    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves({
      user_id: userId,
      token,
    });
    sandbox.stub(refreshTokenMapper, "dbToEntity").returns({
      userId,
      token,
    });

    const refreshToken = await refreshTokenRepository.findOne({
      user_id: userId,
    });

    expect(refreshToken?.userId).equal(userId);
    expect(refreshToken?.token).equal(token);
  });

  it("should return undefined when no RefreshToken is found", async () => {
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves();

    const refreshToken = await refreshTokenRepository.findOne({
      user_id: "test",
    });

    expect(refreshToken).equal(undefined);
  });

  it('should return a RefreshToken from DB passing "userId" as a filter', async () => {
    const userId = faker.string.uuid();
    const token = "refresh-token";

    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves({
      user_id: userId,
      token,
    });
    sandbox.stub(refreshTokenMapper, "dbToEntity").returns({
      userId,
      token,
    });

    const refreshToken = <RefreshToken>(
      await refreshTokenRepository.findOneByUserId(userId)
    );

    expect(refreshToken.userId).equal(userId);
    expect(refreshToken.token).equal(token);
  });

  it('should return undefined when no RefreshToken is found passing "userId" as a filter', async () => {
    sandbox.stub(MongoDbDriver.prototype, "findOne").resolves();

    const refreshToken = await refreshTokenRepository.findOneByUserId("test");

    expect(refreshToken).equal(undefined);
  });

  it("should delete a RefreshToken from DB", async () => {
    sandbox.stub(MongoDbDriver.prototype, "deleteMany").resolves();

    const result = await refreshTokenRepository.deleteAllByUserId(
      faker.string.uuid()
    );

    expect(result).equal(undefined);
  });
});
