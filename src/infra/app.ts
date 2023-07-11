import config from './config'
import routes from './http/v1/routes'
import ExpressDriver from './drivers/ExpressDriver'

const {
  server: {
    httpPort
  }
} = config

const server = new ExpressDriver(httpPort)

server.start(routes.routes, routes.prefix)

const gracefulShutdown = (signal: string, code: number) => {
  server.stop(() => {
    console.log('Shutting server down...')

    process.exit(code)
  })
}

process.on('uncaughtException', (error, origin) => {
  console.log(`[${origin}] ${error}`)
})

process.on('unhandledRejection', (error) => {
  console.log(`[unhandledRejection] ${error}`)
})

process.on('SIGINT', gracefulShutdown)

process.on('SIGTERM', gracefulShutdown)

process.on('exit', (code: number) => {
  console.log(`Server shut down with code: ${code}`)
})
