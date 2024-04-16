import User from '../user/User';
import Memo from './Memo';

export default interface IMemoRepository {
  create(memo: Memo): Promise<void>;
  find(filters?: object, options?: object): Promise<Memo[]>;
  findByUserId(user_id: string, options?: object): Promise<Memo[]>;
  findOne(filters: object): Promise<Memo | undefined>;
  findOneById(memo_id: string): Promise<Memo | undefined>;
  update(memo: Memo, filters?: object): Promise<void>;
  deleteOne(memo: Memo): Promise<void>;
  deleteAllByUser(user: User): Promise<void>;
}
