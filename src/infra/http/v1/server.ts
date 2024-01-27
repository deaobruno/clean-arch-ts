import ExpressDriver from "../../drivers/server/ExpressDriver";
import dependencies from "../../../dependencies";
import routes from "./routes/routes";

const { loggerDriver } = dependencies;
const server = new ExpressDriver(loggerDriver);

routes(server);

export default server;
