import User from "../../../domain/user/User";
import IPresenter from "../IPresenter";

export default class CustomerPresenter implements IPresenter {
  constructor() {}

  toJson = (user: User) => {
    const { userId, email, memos } = user;

    return {
      id: userId,
      email,
    };
  };
}
