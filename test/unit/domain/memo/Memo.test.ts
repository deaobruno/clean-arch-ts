import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import Memo from '../../../../src/domain/memo/Memo';

const memoId = faker.string.uuid();
const userId = faker.string.uuid();
const title = 'New Memo';
const text = 'Lorem ipsum';
const start = new Date(new Date().getTime() + 3.6e6).toISOString();
const end = new Date(new Date().getTime() + 3.6e6 * 2).toISOString();

describe('/domain/memo/Memo.ts', () => {
  it('should create a Memo entity object', () => {
    const memoData = {
      memoId,
      userId,
      title,
      text,
      start,
      end,
    };
    const memo = <Memo>Memo.create(memoData);

    expect(memo.memoId).equal(memoData.memoId);
    expect(memo.userId).equal(memoData.userId);
    expect(memo.title).equal(memoData.title);
    expect(memo.text).equal(memoData.text);
    expect(memo.start).equal(memoData.start);
    expect(memo.end).equal(memoData.end);
  });

  it('should fail when trying to create a Memo entity with empty memoId', () => {
    const memoData = {
      memoId: '',
      userId,
      title,
      text,
      start,
      end,
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] "memoId" required'));
  });

  it('should fail when trying to create an User entity with empty memoId', () => {
    const memoData = {
      memoId: 'test',
      userId,
      title,
      text,
      start,
      end,
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] Invalid "memoId"'));
  });

  it('should fail when trying to create a Memo entity with empty userId', () => {
    const memoData = {
      memoId,
      userId: '',
      title,
      text,
      start,
      end,
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] "userId" required'));
  });

  it('should fail when trying to create an User entity with empty userId', () => {
    const memoData = {
      memoId,
      userId: 'test',
      title,
      text,
      start,
      end,
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] Invalid "userId"'));
  });

  it('should fail when trying to create a Memo entity with empty title', () => {
    const memoData = {
      memoId,
      userId,
      title: '',
      text,
      start,
      end,
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] "title" required'));
  });

  it('should fail when trying to create a Memo entity with empty text', () => {
    const memoData = {
      memoId,
      userId,
      title,
      text: '',
      start,
      end,
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] "text" required'));
  });

  it('should fail when trying to create a Memo entity with empty start date', () => {
    const memoData = {
      memoId,
      userId,
      title,
      text,
      start: '',
      end,
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] "start" required'));
  });

  it('should fail when trying to create a Memo entity with invalid start date', () => {
    const memoData = {
      memoId,
      userId,
      title,
      text,
      start: 'test',
      end,
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] Invalid "start"'));
  });

  it('should fail when trying to create a Memo entity with past start date', () => {
    const memoData = {
      memoId,
      userId,
      title,
      text,
      start: new Date().toISOString(),
      end,
    };

    expect(Memo.create(memoData)).deep.equal(
      Error('[Memo] "start" must be a future date'),
    );
  });

  it('should fail when trying to create a Memo entity with empty end date', () => {
    const memoData = {
      memoId,
      userId,
      title,
      text,
      start,
      end: '',
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] "end" required'));
  });

  it('should fail when trying to create a Memo entity with invalid end date', () => {
    const memoData = {
      memoId,
      userId,
      title,
      text,
      start,
      end: 'test',
    };

    expect(Memo.create(memoData)).deep.equal(Error('[Memo] Invalid "end"'));
  });

  it('should fail when trying to create a Memo entity with past end date', () => {
    const memoData = {
      memoId,
      userId,
      title,
      text,
      start,
      end: new Date().toISOString(),
    };

    expect(Memo.create(memoData)).deep.equal(
      Error('[Memo] "end" must be a future date'),
    );
  });

  it('should fail when trying to create a Memo entity with end date before start date', () => {
    const memoData = {
      memoId,
      userId,
      title,
      text,
      start: new Date(new Date().getTime() + 3.6e6 * 3).toISOString(),
      end,
    };

    expect(Memo.create(memoData)).deep.equal(
      Error('[Memo] "end" must be after "start"'),
    );
  });
});
