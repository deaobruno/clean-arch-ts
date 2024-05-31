import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import CreateMemo from '../../../../../src/application/useCases/memo/CreateMemo';
import Memo from '../../../../../src/domain/memo/Memo';
import MemoRepository from '../../../../../src/adapters/repositories/MemoRepository';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';
import CryptoDriver from '../../../../../src/infra/drivers/hash/CryptoDriver';
import User from '../../../../../src/domain/user/User';
import UserRole from '../../../../../src/domain/user/UserRole';
import InternalServerError from '../../../../../src/application/errors/InternalServerError';

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const title = 'New Memo';
const text = 'Lorem ipsum';
const start = new Date(new Date().getTime() + 3.6e6).toISOString();
const end = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();
const fakeMemo = Memo.create({
  memoId: faker.string.uuid(),
  userId,
  title,
  text,
  start,
  end,
});
const memoData = {
  user: <User>User.create({
    userId,
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: UserRole.CUSTOMER,
  }),
  title,
  text,
  start,
  end,
};

describe('/application/useCases/memo/CreateMemo.ts', () => {
  afterEach(() => sandbox.restore());

  it('should successfully create a Memo', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const createRoot = new CreateMemo(
      loggerDriver,
      cryptoDriver,
      memoRepository,
    );

    cryptoDriver.generateID.returns(faker.string.uuid());
    memoRepository.create.resolves();
    sandbox.stub(Memo, 'create').returns(fakeMemo);

    const result = await createRoot.exec(memoData);

    expect(result).deep.equal(fakeMemo);
  });

  it('should return an InternalServerError when Memo entity returns error', async () => {
    const loggerDriver = sandbox.createStubInstance(PinoDriver);
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const createRoot = new CreateMemo(
      loggerDriver,
      cryptoDriver,
      memoRepository,
    );

    cryptoDriver.generateID.returns('');

    const result = await createRoot.exec(memoData);

    expect(result).deep.equal(new InternalServerError('[Memo] "memoId" required'));
  });
});
