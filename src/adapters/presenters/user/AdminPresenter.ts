import UserRole from "../../../domain/user/UserRole";
import User from "../../../domain/user/User";
import IPresenter from "../IPresenter";

export default class AdminPresenter implements IPresenter {
  toJson(user: User) {
    const { userId, email, level } = user;

    return {
      id: userId,
      email,
      level: UserRole[level],
    };
  }
}
