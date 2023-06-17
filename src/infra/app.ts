import routes from './http/routes'
import ExpressDriver from './drivers/ExpressDriver'

const server = new ExpressDriver()

server.start(routes)

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
