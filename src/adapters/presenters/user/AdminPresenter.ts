import UserRole from "../../../domain/user/UserRole";
import User from "../../../domain/user/User";
import IPresenter from "../IPresenter";

export default class AdminPresenter implements IPresenter {
  constructor(private _memoPresenter: IPresenter) {}

  toJson = (user: User) => {
    const { userId, email, role, memos } = user;

    return {
      id: userId,
      email,
      role: UserRole[role],
      memos: memos.map(this._memoPresenter.toJson),
    };
  };
}
