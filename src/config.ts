import { config } from 'dotenv-safe';

config();

export default {
  server: {
    httpPort: process.env.HTTP_PORT ?? 8080,
  },
  app: {
    environment: process.env.NODE_ENV ?? 'production',
    rootUserEmail: process.env.ROOT_USER_EMAIL ?? '',
    rootUserPassword: process.env.ROOT_USER_PASSWORD ?? '',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
    accessTokenExpirationTime: parseInt(
      process.env.ACCESS_TOKEN_EXPIRATION_TIME ?? '',
    ),
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? '',
    refreshTokenExpirationTime: parseInt(
      process.env.REFRESH_TOKEN_EXPIRATION_TIME ?? '',
    ),
  },
  db: {
    mongo: {
      dbUrl: process.env.MONGO_DB_URL ?? '',
      dbName: process.env.MONGO_DB_NAME ?? '',
    },
    usersSource: process.env.USERS_SOURCE_NAME ?? '',
    refreshTokensSource: process.env.REFRESH_TOKENS_SOURCE_NAME ?? '',
    memosSource: process.env.MEMOS_SOURCE_NAME ?? '',
    devicesSource: process.env.DEVICES_SOURCE_NAME ?? '',
  },
  cache: {
    redis: {
      url: process.env.REDIS_URL ?? '',
      password: process.env.REDIS_PASSWORD ?? '',
    },
  },
  cors: {
    origin: process.env.CORS_ORIGIN ?? '*',
  },
  logger: {
    infoFilePath: process.env.INFO_LOG_FILE_PATH ?? '',
    errorFilePath: process.env.ERROR_LOG_FILE_PATH ?? '',
  },
};
