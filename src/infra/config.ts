import { config } from 'dotenv-safe'

const dotenvConfig = process.env.NODE_ENV === 'development' ?
  { debug: true } :
  {}

config(dotenvConfig)

export default {
  server: {
    httpPort: process.env.HTTP_PORT ?? 8080,
  },
  app: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
    accessTokenExpirationTime: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME ?? ''),
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? '',
    refreshTokenExpirationTime: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME ?? ''),
  },
}
