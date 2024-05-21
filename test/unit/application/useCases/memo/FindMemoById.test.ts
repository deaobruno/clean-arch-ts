import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import FindMemoById from '../../../../../src/application/useCases/memo/FindMemoById';
import { expect } from 'chai';
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

describe('/application/useCases/memo/FindMemoById.ts', () => {
  afterEach(() => sandbox.restore());

  it('should return a memo passing an UUID', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const findMemoById = new FindMemoById(loggerDriver, memoRepository);

    memoRepository.findOneById.resolves(fakeMemo);

    const memo = <Memo>await findMemoById.exec({ user, memo_id: memoId });

    expect(memo.memoId).equal(memoId);
    expect(memo.userId).equal(userId);
    expect(memo.title).equal(fakeMemo.title);
    expect(memo.text).equal(fakeMemo.text);
    expect(memo.start).equal(fakeMemo.start);
    expect(memo.end).equal(fakeMemo.end);
  });

  it('should return a NotFoundError when no memo is found', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const findMemoById = new FindMemoById(loggerDriver, memoRepository);
    const memo_id = 'test';
    const error = <BaseError>await findMemoById.exec({ user, memo_id });

    expect(error).deep.equal(
      new NotFoundError(`[FindMemoById] Memo not found: ${memo_id}`),
    );
  });

  it('should fail when trying to find a memo passing wrong ID', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const findMemoById = new FindMemoById(loggerDriver, memoRepository);

    memoRepository.findOneById.resolves(
      <Memo>Memo.create({ ...fakeMemo, userId: faker.string.uuid() }),
    );

    const result = await findMemoById.exec({ user, memo_id: memoId });

    expect(result).deep.equal(
      new NotFoundError(`[FindMemoById] Memo not found: ${memoId}`),
    );
  });
});
