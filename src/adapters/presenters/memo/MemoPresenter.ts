import Memo from '../../../domain/memo/Memo';
import IPresenter from '../IPresenter';

export default class CustomerPresenter implements IPresenter {
  toJson(memo: Memo) {
    const { memoId, title, text, start, end } = memo;

    return {
      id: memoId,
      title,
      text,
      start,
      end,
    };
  }
}
