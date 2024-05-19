import IMapper from '../IMapper';
import Memo from './Memo';
import IDbMemo from './IDbMemo';

export default class MemoMapper implements IMapper<Memo, IDbMemo> {
  entityToDb(memo: Memo): IDbMemo {
    const { memoId, userId, title, text, start, end } = memo;

    return {
      memo_id: memoId,
      user_id: userId,
      title,
      text,
      start,
      end,
    };
  }

  dbToEntity(data: IDbMemo): Memo | Error {
    const { memo_id, user_id, title, text, start, end } = data;

    return Memo.create({
      memoId: memo_id,
      userId: user_id,
      title,
      text,
      start,
      end,
    });
  }
}
