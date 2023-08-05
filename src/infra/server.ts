import config from './config'
import ExpressDriver from './drivers/server/ExpressDriver'

const {
  server: {
    httpPort
  }
} = config

export default new ExpressDriver(httpPort)
