import Memo from '../../../domain/memo/Memo';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import IPresenter from '../IPresenter';

type JsonMemo = {
  id: string;
  title: string;
  text: string;
  start: string;
  end: string;
};

export default class MemoPresenter implements IPresenter {
  constructor(private logger: ILoggerDriver) {}

  toJson = (memo: Memo): JsonMemo => {
    const { memoId, title, text, start, end } = memo;
    const jsonMemo = {
      id: memoId,
      title,
      text,
      start,
      end,
    };

    this.logger.debug({
      message: `[MemoPresenter/toJson] Formatted memo`,
      memo,
      jsonMemo,
    });

    return jsonMemo;
  };
}
