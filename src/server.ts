import ExpressDriver from './infra/drivers/server/ExpressDriver'

export default (config: any) => {
  const {
    httpPort
  } = config
  
  return new ExpressDriver(httpPort)
}
