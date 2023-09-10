import cluster from 'node:cluster'
import process from 'node:process'
import { availableParallelism } from 'node:os'
import dependencies from './dependencies'
import routes from './infra/http/v1/routes'
import httpServer from './server'
import config from './config'

const v1Routes = routes(dependencies(config.app))
const server = httpServer(config.server)
const numCPUs = availableParallelism()

if (cluster.isPrimary) {
  console.log(`[${process.pid}] Primary is running`)

  for (let i = 0; i < numCPUs; i++)
    cluster.fork()
} else {
  console.log(`[${process.pid}] Worker is running`)

  server.start(v1Routes, '/api/v1')
}

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
