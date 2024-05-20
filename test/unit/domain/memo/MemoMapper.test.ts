import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import PinoDriver from '../../../../src/infra/drivers/logger/PinoDriver'
import Memo from "../../../../src/domain/memo/Memo";
import MemoMapper from "../../../../src/domain/memo/MemoMapper";

const memoMapper = new MemoMapper(sinon.createStubInstance(PinoDriver));

describe("/src/domain/memo/MemoMapper.ts", () => {
  it("should map an memo entity to memo db data", () => {
    const memoData = {
      memoId: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: "New Memo",
      text: "Lorem ipsum",
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };
    const memo = <Memo>Memo.create(memoData);
    const memoDbData = memoMapper.entityToDb(memo);

    expect(memoDbData.memo_id).equal(memo.memoId);
    expect(memoDbData.user_id).equal(memo.userId);
    expect(memoDbData.title).equal(memo.title);
    expect(memoDbData.text).equal(memo.text);
    expect(memoDbData.start).equal(memo.start);
    expect(memoDbData.end).equal(memo.end);
  });

  it("should map memo db data to an memo entity", () => {
    const memoId = faker.string.uuid();
    const userId = faker.string.uuid();
    const title = "New Memo";
    const text = "Lorem ipsum";
    const start = new Date(new Date().getTime() + 3.6e6).toISOString();
    const end = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();

    sinon.stub(Memo, "create").returns({
      memoId,
      userId,
      title,
      text,
      start,
      end,
    });

    const memoDbData = {
      memo_id: memoId,
      user_id: userId,
      title,
      text,
      start,
      end,
    };
    const memo = <Memo>memoMapper.dbToEntity(memoDbData);

    expect(memo.memoId).equal(memoDbData.memo_id);
    expect(memo.userId).equal(memoDbData.user_id);
    expect(memo.title).equal(memoDbData.title);
    expect(memo.text).equal(memoDbData.text);
    expect(memo.start).equal(memoDbData.start);
    expect(memo.end).equal(memoDbData.end);

    sinon.restore();
  });
});
