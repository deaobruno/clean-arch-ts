import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import CreateMemo from "../../../../../src/application/useCases/memo/CreateMemo";
import Memo from "../../../../../src/domain/memo/Memo";
import MemoRepository from "../../../../../src/adapters/repositories/MemoRepository";
import CryptoDriver from "../../../../../src/infra/drivers/hash/CryptoDriver";
import User from "../../../../../src/domain/user/User";
import UserRole from "../../../../../src/domain/user/UserRole";

const sandbox = sinon.createSandbox();
const userId = faker.string.uuid();
const title = "New Memo";
const text = "Lorem ipsum";
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
let memoData = {
  user: User.create({
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

describe("/application/useCases/memo/CreateMemo.ts", () => {
  afterEach(() => sandbox.restore());

  it("should successfully create a Memo", async () => {
    const cryptoDriver = sandbox.createStubInstance(CryptoDriver);
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const createRoot = new CreateMemo(memoRepository, cryptoDriver);

    cryptoDriver.generateID.returns(faker.string.uuid());
    cryptoDriver.hashString.returns("hash");
    memoRepository.create.resolves();
    sandbox.stub(Memo, "create").returns(fakeMemo);

    const result = await createRoot.exec(memoData);

    expect(result).deep.equal(fakeMemo);
  });
});
