import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import DeleteMemo from "../../../../../src/application/useCases/memo/DeleteMemo";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import Memo from "../../../../../src/domain/memo/Memo";
import MemoRepository from "../../../../../src/adapters/repositories/MemoRepository";
import User from "../../../../../src/domain/user/User";
import UserRole from "../../../../../src/domain/user/UserRole";

const sandbox = sinon.createSandbox();
const memoId = faker.string.uuid();
const userId = faker.string.uuid();
const title = "New Memo";
const text = "Lorem ipsum";
const start = new Date(new Date().getTime() + 3.6e6).toISOString();
const end = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();
const fakeMemo = Memo.create({
  memoId,
  userId,
  title,
  text,
  start,
  end,
});
const user = User.create({
  userId,
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: UserRole.CUSTOMER,
});

describe("/application/useCases/memo/DeleteMemo.ts", () => {
  afterEach(() => sandbox.restore());

  it("should delete an existing memo", async () => {
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const deleteMemo = new DeleteMemo(memoRepository);

    memoRepository.findOne.resolves(fakeMemo);
    memoRepository.delete.resolves();

    const result = await deleteMemo.exec({ user, memo_id: memoId });

    expect(result).equal(undefined);
  });

  it("should fail when trying to delete a memo passing wrong ID", async () => {
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const deleteMemo = new DeleteMemo(memoRepository);
    const result = await deleteMemo.exec({ user, memo_id: "" });

    expect(result).deep.equal(new NotFoundError("Memo not found"));
  });
});
