import cluster from 'node:cluster'
import process from 'node:process'
import { availableParallelism } from 'node:os'
import dependencies from './dependencies'
import routes from './infra/http/v1/routes'
import config from './config'

const dependenciesContainer = dependencies(config)
const {
  drivers: {
    httpServerDriver,
  },
} = dependenciesContainer
const numCPUs = availableParallelism()

if (cluster.isPrimary) {
  console.log(`[${process.pid}] Primary is running`)

  for (let i = 0; i < numCPUs; i++)
    cluster.fork()
} else {
  console.log(`[${process.pid}] Worker is running`)

  httpServerDriver.start(config.server.httpPort, routes(dependenciesContainer))
}

const gracefulShutdown = (signal: string, code: number) => {
  httpServerDriver.stop(() => {
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
