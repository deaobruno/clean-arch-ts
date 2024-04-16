import IMemoRepository from '../../domain/memo/IMemoRepository';
import Memo from '../../domain/memo/Memo';
import MemoMapper from '../../domain/memo/MemoMapper';
import User from '../../domain/user/User';
import ICacheDriver from '../../infra/drivers/cache/ICacheDriver';
import IDbDriver from '../../infra/drivers/db/IDbDriver';
import IDbMemo from '../../domain/memo/IDbMemo';

export default class MemoRepository implements IMemoRepository {
  constructor(
    private _source: string,
    private _dbDriver: IDbDriver<IDbMemo>,
    private _cacheDriver: ICacheDriver,
    private _mapper: MemoMapper,
  ) {}

  async create(memo: Memo): Promise<void> {
    const dbMemo = this._mapper.entityToDb(memo);

    await this._dbDriver.create(this._source, dbMemo);

    await this._cacheDriver.del(memo.userId);
  }

  async find(filters?: object, options = {}): Promise<Memo[]> {
    const memos = await this._dbDriver.find(this._source, filters, options);

    return memos.map(this._mapper.dbToEntity);
  }

  async findByUserId(user_id: string, options = {}): Promise<Memo[]> {
    return this.find({ user_id }, options);
  }

  async findOne(filters: object): Promise<Memo | undefined> {
    const memo = await this._dbDriver.findOne(this._source, filters);

    if (memo) return this._mapper.dbToEntity(memo);
  }

  async findOneById(memo_id: string): Promise<Memo | undefined> {
    const cachedMemo = <Memo>await this._cacheDriver.get(memo_id);

    if (cachedMemo) return cachedMemo;

    const memo = await this.findOne({ memo_id });

    if (memo) {
      await this._cacheDriver.set(memo_id, memo);
    }

    return memo;
  }

  async update(memo: Memo): Promise<void> {
    const { memoId: memo_id, userId } = memo;
    const dbMemo = this._mapper.entityToDb(memo);

    await this._dbDriver.update(this._source, dbMemo, {
      memo_id,
    });

    await this._cacheDriver.del(memo_id);
    await this._cacheDriver.del(userId);
  }

  async deleteOne(memo: Memo): Promise<void> {
    const { memoId: memo_id, userId } = memo;

    await this._dbDriver.delete(this._source, { memo_id });

    await this._cacheDriver.del(memo_id);
    await this._cacheDriver.del(userId);
  }

  async deleteAllByUser(user: User): Promise<void> {
    const { memos } = user;

    memos.forEach(this.deleteOne);
  }
}
