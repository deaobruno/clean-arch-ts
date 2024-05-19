import ExpressDriver from '../../drivers/server/ExpressDriver';
import dependencies from '../../../dependencies';
import routes from './routes/routes';
import config from '../../../config';

const { loggerDriver, hashDriver } = dependencies;
const server = new ExpressDriver(loggerDriver, hashDriver, config.cors);

routes(server);

export default server;
