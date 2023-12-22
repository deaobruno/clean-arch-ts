import Memo from "./Memo";

export default interface IMemoRepository {
  create(data: Memo): Promise<void>;
  find(filters?: object): Promise<Memo[]>;
  findByUserId(user_id: string): Promise<Memo[]>;
  findOne(filters: object): Promise<Memo | undefined>;
  update(data: Memo, filters?: object): Promise<void>;
  delete(filters: object): Promise<void>;
  deleteAllByUserId(user_id: string): Promise<void>;
}
