import dependencies from "../../../../dependencies";
import IServer from "../../../drivers/server/IServerDriver";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import memoRoutes from "./memoRoutes";

export default (server: IServer): void => {
  const prefix = "/api/v1";

  authRoutes(dependencies, server, prefix);
  userRoutes(dependencies, server, prefix);
  memoRoutes(dependencies, server, prefix);
};
