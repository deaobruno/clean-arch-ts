import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import FindMemosByUserId from '../../../../../src/application/useCases/memo/FindMemosByUserId';
import NotFoundError from '../../../../../src/application/errors/NotFoundError';
import BaseError from '../../../../../src/application/errors/BaseError';
import MemoRepository from '../../../../../src/adapters/repositories/MemoRepository';
import Memo from '../../../../../src/domain/memo/Memo';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

const sandbox = sinon.createSandbox();
const memoId = faker.string.uuid();
const userId = faker.string.uuid();
const title = 'New Memo';
const text = 'Lorem ipsum';
const start = new Date(new Date().getTime() + 3.6e6).toISOString();
const end = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();
const fakeMemo = <Memo>Memo.create({
  memoId,
  userId,
  title,
  text,
  start,
  end,
});
const user = <User>User.create({
  userId,
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: UserRole.CUSTOMER,
});

describe('/application/useCases/memo/FindMemosByUserId.ts', () => {
  afterEach(() => sandbox.restore());

  it('should return an array of memos passing user_id', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const findMemosByUserId = new FindMemosByUserId(
      loggerDriver,
      memoRepository,
    );

    memoRepository.findByUserId.resolves([fakeMemo]);

    const memos = await findMemosByUserId.exec({ user, user_id: userId });

    expect(memos[0].memoId).equal(memoId);
    expect(memos[0].userId).equal(userId);
    expect(memos[0].title).equal(fakeMemo.title);
    expect(memos[0].text).equal(fakeMemo.text);
    expect(memos[0].start).equal(fakeMemo.start);
    expect(memos[0].end).equal(fakeMemo.end);
  });

  it('should return an array of memos with pagination passing user_id', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const findMemosByUserId = new FindMemosByUserId(
      loggerDriver,
      memoRepository,
    );

    memoRepository.findByUserId.resolves([fakeMemo]);

    const memos = await findMemosByUserId.exec({
      user,
      user_id: userId,
      limit: '1',
      page: '0',
    });

    expect(memos[0].memoId).equal(memoId);
    expect(memos[0].userId).equal(userId);
    expect(memos[0].title).equal(fakeMemo.title);
    expect(memos[0].text).equal(fakeMemo.text);
    expect(memos[0].start).equal(fakeMemo.start);
    expect(memos[0].end).equal(fakeMemo.end);
  });

  it('should return a NotFoundError when request user is different from user_id', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const findMemosByUserId = new FindMemosByUserId(
      loggerDriver,
      memoRepository,
    );
    const user_id = 'test';
    const error = <BaseError>await findMemosByUserId.exec({ user, user_id });

    expect(error).deep.equal(
      new NotFoundError(
        `[FindMemosByUserId] Memos not found for user: ${user_id}`,
      ),
    );
  });

  it('should return a NotFoundError when no memos are found for user_id', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const findMemosByUserId = new FindMemosByUserId(
      loggerDriver,
      memoRepository,
    );

    memoRepository.findByUserId.resolves([]);

    const error = <BaseError>(
      await findMemosByUserId.exec({ user, user_id: userId })
    );

    expect(error).deep.equal(
      new NotFoundError(
        `[FindMemosByUserId] Memos not found for user: ${userId}`,
      ),
    );
  });
});
