import IMemoRepository from '../../domain/memo/IMemoRepository';
import Memo from '../../domain/memo/Memo';
import MemoMapper from '../../domain/memo/MemoMapper';
import User from '../../domain/user/User';
import ICacheDriver from '../../infra/drivers/cache/ICacheDriver';
import IDbDriver from '../../infra/drivers/db/IDbDriver';
import IDbMemo from '../../domain/memo/IDbMemo';
import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';

export default class MemoRepository implements IMemoRepository {
  constructor(
    private source: string,
    private logger: ILoggerDriver,
    private db: IDbDriver<IDbMemo>,
    private cache: ICacheDriver,
    private mapper: MemoMapper,
  ) {}

  async create(memo: Memo): Promise<void> {
    const dbMemo = this.mapper.entityToDb(memo);

    await this.db.create(this.source, dbMemo);
    await this.cache.del(memo.userId);

    this.logger.debug({
      message: '[MemoRepository/create] Memo created',
      memo,
      dbMemo,
    });
  }

  async find(filters?: object, options = {}): Promise<Memo[]> {
    const dbMemos = await this.db.find(this.source, filters, options);
    const memos = dbMemos.map((memo) => <Memo>this.mapper.dbToEntity(memo));
    const message =
      memos.length > 0
        ? '[MemoRepository/find] Memo(s) found'
        : '[MemoRepository/find] Memos not found';

    this.logger.debug({
      message,
      filters,
      options,
      dbMemos,
      memos,
    });

    return memos;
  }

  async findByUserId(user_id: string, options = {}): Promise<Memo[]> {
    return this.find({ user_id }, options);
  }

  async findOne(filters: object): Promise<Memo | undefined> {
    const dbMemo = await this.db.findOne(this.source, filters);

    if (!dbMemo) {
      this.logger.debug({
        message: '[MemoRepository/findOne] Memo not found',
        filters,
      });

      return;
    }

    const memo = <Memo>this.mapper.dbToEntity(dbMemo);

    this.logger.debug({
      message: '[MemoRepository/findOne] Memo found',
      filters,
      dbMemo,
      memo,
    });

    return memo;
  }

  async findOneById(memo_id: string): Promise<Memo | undefined> {
    const cachedMemo = <Memo>await this.cache.get(memo_id);

    if (cachedMemo) return cachedMemo;

    const memo = await this.findOne({ memo_id });

    if (memo) await this.cache.set(memo_id, memo);

    return memo;
  }

  async update(memo: Memo): Promise<void> {
    const { memoId: memo_id, userId } = memo;
    const dbMemo = this.mapper.entityToDb(memo);

    await this.db.update(this.source, dbMemo, {
      memo_id,
    });

    await this.cache.del(memo_id);
    await this.cache.del(userId);

    this.logger.debug({
      message: '[MemoRepository/update] Memo updated',
      memo,
      dbMemo,
    });
  }

  async deleteOne(memo: Memo): Promise<void> {
    const { memoId: memo_id, userId } = memo;

    await this.db.delete(this.source, { memo_id });
    await this.cache.del(memo_id);
    await this.cache.del(userId);

    this.logger.debug({
      message: '[MemoRepository/delete] Memo deleted',
      memo,
    });
  }

  async deleteAllByUser(user: User): Promise<void> {
    const { memos } = user;

    memos.forEach(this.deleteOne);
  }
}
