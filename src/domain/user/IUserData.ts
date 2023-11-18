import UserRole from "./UserRole";

type IUserData = {
  userId: string;
  email: string;
  password: string;
  role: UserRole;
};

export default IUserData;
