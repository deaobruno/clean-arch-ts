import UserRole from "./UserRole";

type IUserData = {
  userId: string;
  email: string;
  password: string;
  level: UserRole;
};

export default IUserData;
