import dependencies from "../../../../dependencies";
import IServer from "../../../drivers/server/IServerDriver";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

export default (server: IServer) => {
  const prefix = "/api/v1";

  return [
    ...authRoutes(dependencies, server, prefix),
    ...userRoutes(dependencies, server, prefix),
  ];
};
