import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import config from '../../../../src/config';
import PinoDriver from '../../../../src/infra/drivers/logger/PinoDriver';
import MongoDbDriver from '../../../../src/infra/drivers/db/MongoDbDriver';
import MemoRepository from '../../../../src/adapters/repositories/MemoRepository';
import MemoMapper from '../../../../src/domain/memo/MemoMapper';
import RedisDriver from '../../../../src/infra/drivers/cache/RedisDriver';
import Memo from '../../../../src/domain/memo/Memo';
import UserRole from '../../../../src/domain/user/UserRole';
import IDbMemo from '../../../../src/domain/memo/IDbMemo';

const sandbox = sinon.createSandbox();

describe('/adapters/repositories/MemoRepository', () => {
  afterEach(() => sandbox.restore());

  it('should save an User entity', async () => {
    const memoId = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'New Memo';
    const text = 'Lorem ipsum';
    const start = new Date(new Date().getTime() + 3.6e6).toISOString();
    const end = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();
    const fakeMemo = {
      memoId,
      userId,
      title,
      text,
      start,
      end,
    };
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    sandbox.stub(Memo, 'create').returns(fakeMemo);
    memoMapper.entityToDb.returns({
      memo_id: memoId,
      user_id: userId,
      title,
      text,
      start,
      end,
    });
    dbDriver.create.resolves();

    const result = await memoRepository.create(fakeMemo);

    expect(result).equal(undefined);
  });

  it('should return all memos from DB when no filter is passed', async () => {
    const dbMemos = [
      {
        memo_id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        title: 'Memo 1',
        text: 'Lorem ipsum 1',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      },
      {
        memo_id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        title: 'Memo 2',
        text: 'Lorem ipsum 2',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      },
      {
        memo_id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        title: 'Memo 3',
        text: 'Lorem ipsum 3',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      },
    ];
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.find.resolves(dbMemos);
    sandbox;
    memoMapper.dbToEntity
      .withArgs(dbMemos[0])
      .returns({
        memoId: dbMemos[0].memo_id,
        userId: dbMemos[0].user_id,
        title: dbMemos[0].title,
        text: dbMemos[0].text,
        start: dbMemos[0].start,
        end: dbMemos[0].end,
      })
      .withArgs(dbMemos[1])
      .returns({
        memoId: dbMemos[1].memo_id,
        userId: dbMemos[1].user_id,
        title: dbMemos[1].title,
        text: dbMemos[1].text,
        start: dbMemos[1].start,
        end: dbMemos[1].end,
      })
      .withArgs(dbMemos[2])
      .returns({
        memoId: dbMemos[2].memo_id,
        userId: dbMemos[2].user_id,
        title: dbMemos[2].title,
        text: dbMemos[2].text,
        start: dbMemos[2].start,
        end: dbMemos[2].end,
      });

    const memos = await memoRepository.find();

    expect(memos[0].memoId).equal(dbMemos[0].memo_id);
    expect(memos[0].userId).equal(dbMemos[0].user_id);
    expect(memos[0].title).equal(dbMemos[0].title);
    expect(memos[0].text).equal(dbMemos[0].text);
    expect(memos[0].start).equal(dbMemos[0].start);
    expect(memos[0].end).equal(dbMemos[0].end);
    expect(memos[1].memoId).equal(dbMemos[1].memo_id);
    expect(memos[1].userId).equal(dbMemos[1].user_id);
    expect(memos[1].title).equal(dbMemos[1].title);
    expect(memos[1].text).equal(dbMemos[1].text);
    expect(memos[1].start).equal(dbMemos[1].start);
    expect(memos[1].end).equal(dbMemos[1].end);
    expect(memos[2].memoId).equal(dbMemos[2].memo_id);
    expect(memos[2].userId).equal(dbMemos[2].user_id);
    expect(memos[2].title).equal(dbMemos[2].title);
    expect(memos[2].text).equal(dbMemos[2].text);
    expect(memos[2].start).equal(dbMemos[2].start);
    expect(memos[2].end).equal(dbMemos[2].end);
  });

  it('should return filtered memos from DB when some filter is passed', async () => {
    const userId = faker.string.uuid();
    const dbMemos = [
      {
        memo_id: faker.string.uuid(),
        user_id: userId,
        title: 'Memo 1',
        text: 'Lorem ipsum 1',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      },
      {
        memo_id: faker.string.uuid(),
        user_id: userId,
        title: 'Memo 2',
        text: 'Lorem ipsum 2',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      },
      {
        memo_id: faker.string.uuid(),
        user_id: userId,
        title: 'Memo 3',
        text: 'Lorem ipsum 3',
        start: new Date(new Date().getTime() + 3.6e6).toISOString(),
        end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
      },
    ];
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.find.resolves(dbMemos);
    sandbox;
    memoMapper.dbToEntity
      .withArgs(dbMemos[0])
      .returns({
        memoId: dbMemos[0].memo_id,
        userId: dbMemos[0].user_id,
        title: dbMemos[0].title,
        text: dbMemos[0].text,
        start: dbMemos[0].start,
        end: dbMemos[0].end,
      })
      .withArgs(dbMemos[1])
      .returns({
        memoId: dbMemos[1].memo_id,
        userId: dbMemos[1].user_id,
        title: dbMemos[1].title,
        text: dbMemos[1].text,
        start: dbMemos[1].start,
        end: dbMemos[1].end,
      });

    const memos = await memoRepository.find({ user_id: userId });

    expect(memos[0].memoId).equal(dbMemos[0].memo_id);
    expect(memos[0].userId).equal(dbMemos[0].user_id);
    expect(memos[0].title).equal(dbMemos[0].title);
    expect(memos[0].text).equal(dbMemos[0].text);
    expect(memos[0].start).equal(dbMemos[0].start);
    expect(memos[0].end).equal(dbMemos[0].end);
    expect(memos[1].memoId).equal(dbMemos[1].memo_id);
    expect(memos[1].userId).equal(dbMemos[1].user_id);
    expect(memos[1].title).equal(dbMemos[1].title);
    expect(memos[1].text).equal(dbMemos[1].text);
    expect(memos[1].start).equal(dbMemos[1].start);
    expect(memos[1].end).equal(dbMemos[1].end);
  });

  it('should return an empty array when no memos are found', async () => {
    const dbMemos: IDbMemo[] = [];
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.find.resolves(dbMemos);

    const users = await memoRepository.find();

    expect(users.length).equal(0);
  });

  it('should return a memo from DB when some filter is passed', async () => {
    const dbMemo = {
      memo_id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      title: 'New Memo',
      text: 'Lorem ipsum',
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.findOne.resolves(dbMemo);
    memoMapper.dbToEntity.returns({
      memoId: dbMemo.memo_id,
      userId: dbMemo.user_id,
      title: dbMemo.title,
      text: dbMemo.text,
      start: dbMemo.start,
      end: dbMemo.end,
    });

    const memo = await memoRepository.findOne({ memo_id: dbMemo.memo_id });

    expect(memo?.memoId).equal(dbMemo.memo_id);
    expect(memo?.userId).equal(dbMemo.user_id);
    expect(memo?.title).equal(dbMemo.title);
    expect(memo?.text).equal(dbMemo.text);
    expect(memo?.start).equal(dbMemo.start);
    expect(memo?.end).equal(dbMemo.end);
  });

  it('should return undefined when no memo is found', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.findOne.resolves();

    const memo = await memoRepository.findOne({ memo_id: 'test' });

    expect(memo).equal(undefined);
  });

  it('should return a memo from db passing memo_id as a filter', async () => {
    const dbMemo = {
      memo_id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      title: 'New Memo',
      text: 'Lorem ipsum',
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.findOne.resolves(dbMemo);
    memoMapper.dbToEntity.returns({
      memoId: dbMemo.memo_id,
      userId: dbMemo.user_id,
      title: dbMemo.title,
      text: dbMemo.text,
      start: dbMemo.start,
      end: dbMemo.end,
    });

    const memo = await memoRepository.findOneById(dbMemo.memo_id);

    expect(memo?.memoId).equal(dbMemo.memo_id);
    expect(memo?.userId).equal(dbMemo.user_id);
    expect(memo?.title).equal(dbMemo.title);
    expect(memo?.text).equal(dbMemo.text);
    expect(memo?.start).equal(dbMemo.start);
    expect(memo?.end).equal(dbMemo.end);
  });

  it('should return a memo from cache passing memo_id as a filter', async () => {
    const memoData = {
      memoId: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: 'New Memo',
      text: 'Lorem ipsum',
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    cacheDriver.get.resolves(Memo.create(memoData));

    const memo = await memoRepository.findOneById(memoData.memoId);

    expect(memo?.memoId).equal(memoData.memoId);
    expect(memo?.userId).equal(memoData.userId);
    expect(memo?.title).equal(memoData.title);
    expect(memo?.text).equal(memoData.text);
    expect(memo?.start).equal(memoData.start);
    expect(memo?.end).equal(memoData.end);
  });

  it('should return undefined when passing an invalid memo_id as a filter', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.findOne.resolves();

    const memo = await memoRepository.findOneById('');

    expect(memo).equal(undefined);
  });

  it('should return an array of memos passing user_id as a filter', async () => {
    const dbMemo = {
      memo_id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      title: 'New Memo',
      text: 'Lorem ipsum',
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.find.resolves([dbMemo]);
    memoMapper.dbToEntity.returns({
      memoId: dbMemo.memo_id,
      userId: dbMemo.user_id,
      title: dbMemo.title,
      text: dbMemo.text,
      start: dbMemo.start,
      end: dbMemo.end,
    });

    const memos = await memoRepository.findByUserId(dbMemo.user_id);

    expect(memos[0].memoId).equal(dbMemo.memo_id);
    expect(memos[0].userId).equal(dbMemo.user_id);
    expect(memos[0].title).equal(dbMemo.title);
    expect(memos[0].text).equal(dbMemo.text);
    expect(memos[0].start).equal(dbMemo.start);
    expect(memos[0].end).equal(dbMemo.end);
  });

  it('should return an empty array when passing an invalid user_id as a filter', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.find.resolves([]);

    const memos = await memoRepository.findByUserId('');

    expect(memos).deep.equal([]);
  });

  it('should update a memo from DB', async () => {
    const memoId = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'New Memo';
    const text = 'Lorem ipsum';
    const start = new Date(new Date().getTime() + 3.6e6).toISOString();
    const end = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();
    const fakeMemo = {
      memoId,
      userId,
      title,
      text,
      start,
      end,
    };
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.update.resolves();

    const result = await memoRepository.update(fakeMemo);

    expect(result).equal(undefined);
  });

  it('should delete a memo from DB', async () => {
    const memoId = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = 'New Memo';
    const text = 'Lorem ipsum';
    const start = new Date(new Date().getTime() + 3.6e6).toISOString();
    const end = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();
    const fakeMemo = {
      memoId,
      userId,
      title,
      text,
      start,
      end,
    };
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.delete.resolves();

    const result = await memoRepository.deleteOne(fakeMemo);

    expect(result).equal(undefined);
  });

  it('should delete all memos passing user_id from DB', async () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const role = UserRole.CUSTOMER;
    const fakeUser = {
      userId,
      email,
      password,
      role,
      isRoot: false,
      isCustomer: true,
      memos: [],
      addMemo: () => {},
    };
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const dbDriver = sandbox.createStubInstance(MongoDbDriver);
    const cacheDriver = sandbox.createStubInstance(RedisDriver);
    const memoMapper = sandbox.createStubInstance(MemoMapper);
    const memoRepository = new MemoRepository(
      config.db.memosSource,
      loggerDriver,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>dbDriver,
      cacheDriver,
      memoMapper,
    );

    dbDriver.deleteMany.resolves();

    const result = await memoRepository.deleteAllByUser(fakeUser);

    expect(result).equal(undefined);
  });
});
