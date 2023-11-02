import config from '../../../config'
import dependencies from '../../../dependencies'
import ExpressDriver from '../../drivers/server/ExpressDriver'
import routes from './routes/routes'

const dependenciesContainer = dependencies(config)
const server = new ExpressDriver(config.server.httpPort)

routes(dependenciesContainer, server)

export default server
