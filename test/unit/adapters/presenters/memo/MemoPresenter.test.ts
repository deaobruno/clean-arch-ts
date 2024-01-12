import { faker } from "@faker-js/faker";
import { expect } from "chai";
import MemoPresenter from "../../../../../src/adapters/presenters/memo/MemoPresenter";
import Memo from "../../../../../src/domain/memo/Memo";

const memoPresenter = new MemoPresenter();

describe("/application/presenters/memo/MemoPresenter.ts", () => {
  it("should return an external representation of a memo object", () => {
    const memoData = {
      memoId: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: "New Title",
      text: "Lorem ipsum",
      start: new Date(new Date().getTime() + 3.6e6).toISOString(),
      end: new Date(new Date().getTime() + 3.6e6 * 2).toISOString(),
    };
    const memo = Memo.create(memoData);
    const memoJson = memoPresenter.toJson(memo);

    expect(memoJson.id).equal(memoData.memoId);
    expect(memoJson.title).equal(memoData.title);
    expect(memoJson.text).equal(memoData.text);
    expect(memoJson.start).equal(memoData.start);
    expect(memoJson.end).equal(memoData.end);
  });
});
