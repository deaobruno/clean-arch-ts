import ExpressDriver from "../../drivers/server/ExpressDriver";
import routes from "./routes/routes";

const server = new ExpressDriver();

server.config(routes(server));

export default server;
