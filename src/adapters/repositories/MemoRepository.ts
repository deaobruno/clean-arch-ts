import IMemoRepository from "../../domain/memo/IMemoRepository";
import Memo from "../../domain/memo/Memo";
import MemoMapper from "../../domain/memo/MemoMapper";
import IDbDriver from "../../infra/drivers/db/IDbDriver";

export default class MemoRepository implements IMemoRepository {
  constructor(
    private _source: string,
    private _dbDriver: IDbDriver,
    private _mapper: MemoMapper
  ) {}

  async create(memo: Memo): Promise<void> {
    const dbMemo = this._mapper.entityToDb(memo);

    await this._dbDriver.create(this._source, dbMemo);
  }

  async find(filters?: object): Promise<Memo[]> {
    const memos = await this._dbDriver.find(this._source, filters);

    return memos.map(this._mapper.dbToEntity);
  }

  async findByUserId(user_id: string): Promise<Memo[]> {
    const memos = await this._dbDriver.find(this._source, { user_id });

    return memos.map(this._mapper.dbToEntity);
  }

  async findOne(filters: object): Promise<Memo | undefined> {
    const memo = await this._dbDriver.findOne(this._source, filters);

    if (memo) return this._mapper.dbToEntity(memo);
  }

  async update(memo: Memo): Promise<void> {
    const dbMemo = this._mapper.entityToDb(memo);

    await this._dbDriver.update(this._source, dbMemo, {
      memo_id: memo.memoId,
    });
  }

  async delete(filters?: object): Promise<void> {
    await this._dbDriver.delete(this._source, filters);
  }

  async deleteAllByUserId(user_id: string): Promise<void> {
    await this._dbDriver.deleteMany(this._source, { user_id });
  }
}
