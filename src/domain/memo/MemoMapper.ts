import IMapper from '../IMapper';
import Memo from './Memo';
import IDbMemo from './IDbMemo';
import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';

export default class MemoMapper implements IMapper<Memo, IDbMemo> {
  constructor(private logger: ILoggerDriver) {}

  entityToDb(memo: Memo): IDbMemo {
    const { memoId, userId, title, text, start, end } = memo;
    const dbMemo = {
      memo_id: memoId,
      user_id: userId,
      title,
      text,
      start,
      end,
    };

    this.logger.debug({
      message: '[MemoMapper/entityToDb] Memo entity mapped to db data',
      memo,
      dbMemo,
    });

    return dbMemo;
  }

  dbToEntity(dbMemo: IDbMemo): Memo | Error {
    const { memo_id, user_id, title, text, start, end } = dbMemo;
    const memo = Memo.create({
      memoId: memo_id,
      userId: user_id,
      title,
      text,
      start,
      end,
    });

    this.logger.debug({
      message: '[MemoMapper/entityToDb] Memo db data mapped to entity',
      dbMemo,
      memo,
    });

    return memo;
  }
}
