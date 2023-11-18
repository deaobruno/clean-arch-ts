import IMapper from "../IMapper";
import User from "./User";
import IDbUser from "./IDbUser";

export default class UserMapper implements IMapper<User, IDbUser> {
  entityToDb(user: User): IDbUser {
    const { userId, email, password, role } = user;

    return {
      user_id: userId,
      email,
      password,
      role,
    };
  }

  dbToEntity(data: IDbUser): User {
    const { user_id, email, password, role } = data;

    return User.create({
      userId: user_id,
      email,
      password,
      role,
    });
  }
}
