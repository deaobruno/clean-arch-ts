import IMemoData from './IMemoData';

export default class Memo {
  readonly memoId: string;
  readonly userId: string;
  public title: string;
  public text: string;
  public start: string;
  public end: string;

  private constructor(data: IMemoData) {
    const { memoId, userId, title, text, start, end } = data;

    this.memoId = memoId;
    this.userId = userId;
    this.title = title;
    this.text = text;
    this.start = start;
    this.end = end;
  }

  static create(data: IMemoData): Memo {
    const { memoId, userId, title, text, start, end } = data;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;
    const dateRegex =
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    const nowMs = new Date().getTime();

    if (!memoId) throw new Error('Memo: "memoId" required');

    if (!uuidRegex.test(memoId)) throw new Error('Memo: Invalid "memoId"');

    if (!userId) throw new Error('Memo: "userId" required');

    if (!uuidRegex.test(userId)) throw new Error('Memo: Invalid "userId"');

    if (!title) throw new Error('Memo: "title" required');

    if (!text) throw new Error('Memo: "text" required');

    if (!start) throw new Error('Memo: "start" required');

    if (!dateRegex.test(start)) throw new Error('Memo: Invalid "start"');

    const startMs = new Date(start).getTime();

    if (startMs <= nowMs)
      throw new Error('Memo: "start" must be a future date');

    if (!end) throw new Error('Memo: "end" required');

    if (!dateRegex.test(end)) throw new Error('Memo: Invalid "end"');

    const endMs = new Date(end).getTime();

    if (endMs <= nowMs) throw new Error('Memo: "end" must be a future date');

    if (endMs < startMs) throw new Error('Memo: "end" must be after "start"');

    return new Memo(data);
  }
}
