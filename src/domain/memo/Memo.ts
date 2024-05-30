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

  static create(data: IMemoData): Memo | Error {
    const { memoId, userId, title, text, start, end } = data;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;
    const dateRegex =
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    const nowMs = new Date().getTime();

    if (!memoId) return Error('[Memo] "memoId" required');

    if (!uuidRegex.test(memoId)) return Error('[Memo] Invalid "memoId"');

    if (!userId) return Error('[Memo] "userId" required');

    if (!uuidRegex.test(userId)) return Error('[Memo] Invalid "userId"');

    if (!title) return Error('[Memo] "title" required');

    if (!text) return Error('[Memo] "text" required');

    if (!start) return Error('[Memo] "start" required');

    if (!dateRegex.test(start)) return Error('[Memo] Invalid "start"');

    const startMs = new Date(start).getTime();

    if (startMs <= nowMs) return Error('[Memo] "start" must be a future date');

    if (!end) return Error('[Memo] "end" required');

    if (!dateRegex.test(end)) return Error('[Memo] Invalid "end"');

    const endMs = new Date(end).getTime();

    if (endMs <= nowMs) return Error('[Memo] "end" must be a future date');

    if (endMs < startMs) return Error('[Memo] "end" must be after "start"');

    return new Memo(data);
  }
}
