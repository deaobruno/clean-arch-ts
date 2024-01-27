import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import UserRole from "../../../../../src/domain/user/UserRole";
import User from "../../../../../src/domain/user/User";
import UpdateMemo from "../../../../../src/application/useCases/memo/UpdateMemo";
import NotFoundError from "../../../../../src/application/errors/NotFoundError";
import BaseError from "../../../../../src/application/errors/BaseError";
import MemoRepository from "../../../../../src/adapters/repositories/MemoRepository";
import Memo from "../../../../../src/domain/memo/Memo";

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

describe("/application/useCases/memo/UpdateMemo.ts", () => {
  afterEach(() => sandbox.restore());

  it("should return updated memo", async () => {
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const updateMemo = new UpdateMemo(memoRepository);
    const newTitle = "New Title";
    const newText = "New text";
    const newStart = new Date(new Date().getTime() + 3.6e6).toISOString();
    const newEnd = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();

    memoRepository.findOne.resolves(fakeMemo);
    memoRepository.update.resolves();

    const memo = <Memo>await updateMemo.exec({
      user,
      memo_id: memoId,
      title: newTitle,
      text: newText,
      start: newStart,
      end: newEnd,
    });

    expect(memo.memoId).equal(memoId);
    expect(memo.userId).equal(userId);
    expect(memo.title).equal(newTitle);
    expect(memo.text).equal(newText);
    expect(memo.start).equal(newStart);
    expect(memo.end).equal(newEnd);
  });

  it("should return the same memo when no attribute is updated", async () => {
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const updateMemo = new UpdateMemo(memoRepository);

    memoRepository.findOne.resolves(fakeMemo);
    memoRepository.update.resolves();

    const memo = <Memo>await updateMemo.exec({
      user,
      memo_id: memoId,
    });

    expect(memo).deep.equal(fakeMemo);
  });

  it("should return a NotFoundError when memo is not found", async () => {
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const updateMemo = new UpdateMemo(memoRepository);
    const newTitle = "New Title";
    const error = <BaseError>(
      await updateMemo.exec({ user, memo_id: "test", title: newTitle })
    );

    expect(error).deep.equal(new NotFoundError("Memo not found"));
  });

  it("should fail when trying to update a memo passing wrong ID", async () => {
    const memoRepository = sandbox.createStubInstance(MemoRepository);
    const updateMemo = new UpdateMemo(memoRepository);

    memoRepository.findOne.resolves(
      Memo.create({ ...fakeMemo, userId: faker.string.uuid() })
    );

    const result = await updateMemo.exec({ user, memo_id: memoId });

    expect(result).deep.equal(new NotFoundError("Memo not found"));
  });
});
