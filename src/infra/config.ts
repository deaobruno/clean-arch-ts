import { config } from 'dotenv-safe'

const dotenvConfig = process.env.NODE_ENV === 'development' ?
  { debug: true } :
  {}

config(dotenvConfig)

export default {
  server: {
    httpPort: process.env.HTTP_PORT ?? 8080,
  },
}
