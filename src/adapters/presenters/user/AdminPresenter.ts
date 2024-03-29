import UserRole from "../../../domain/user/UserRole";
import User from "../../../domain/user/User";
import IPresenter from "../IPresenter";

export default class AdminPresenter implements IPresenter {
  constructor() {}

  toJson = (user: User) => {
    const { userId, email, role } = user;

    return {
      id: userId,
      email,
      role: UserRole[role],
    };
  };
}
