import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import DeleteMemo from '../../../../../src/application/useCases/memo/DeleteMemo';
import NotFoundError from '../../../../../src/application/errors/NotFoundError';
import Memo from '../../../../../src/domain/memo/Memo';
import MemoRepository from '../../../../../src/adapters/repositories/MemoRepository';
import User from '../../../../../src/domain/user/User';
import UserRole from '../../../../../src/domain/user/UserRole';
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

describe('/application/useCases/memo/DeleteMemo.ts', () => {
  afterEach(() => sandbox.restore());

  it('should delete an existing memo', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const deleteMemo = new DeleteMemo(loggerDriver, memoRepository);

    memoRepository.findOneById.resolves(fakeMemo);
    memoRepository.deleteOne.resolves();

    const result = await deleteMemo.exec({ user, memo_id: memoId });

    expect(result).equal(undefined);
  });

  it('should fail when trying to delete a memo passing empty ID', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const deleteMemo = new DeleteMemo(loggerDriver, memoRepository);
    const result = await deleteMemo.exec({ user, memo_id: '' });

    expect(result).deep.equal(
      new NotFoundError(`[DeleteMemo] Memo not found: `),
    );
  });

  it('should fail when trying to delete a memo passing wrong ID', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const deleteMemo = new DeleteMemo(loggerDriver, memoRepository);

    memoRepository.findOneById.resolves(
      <Memo>Memo.create({ ...fakeMemo, userId: faker.string.uuid() }),
    );

    const result = await deleteMemo.exec({ user, memo_id: memoId });

    expect(result).deep.equal(
      new NotFoundError(`[DeleteMemo] Memo not found: ${memoId}`),
    );
  });
});
