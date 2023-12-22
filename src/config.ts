import { config } from "dotenv-safe";

config();

export default {
  server: {
    httpPort: process.env.HTTP_PORT ?? 8080,
  },
  app: {
    rootUserEmail: process.env.ROOT_USER_EMAIL ?? "",
    rootUserPassword: process.env.ROOT_USER_PASSWORD ?? "",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
    accessTokenExpirationTime: parseInt(
      process.env.ACCESS_TOKEN_EXPIRATION_TIME ?? ""
    ),
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",
    refreshTokenExpirationTime: parseInt(
      process.env.REFRESH_TOKEN_EXPIRATION_TIME ?? ""
    ),
  },
  db: {
    mongo: {
      dbUrl: process.env.MONGO_DB_URL ?? "",
      dbName: process.env.MONGO_DB_NAME ?? "",
    },
    usersSource: process.env.USERS_SOURCE_NAME ?? "",
    refreshTokensSource: process.env.REFRESH_TOKENS_SOURCE_NAME ?? "",
    memoSource: process.env.MEMO_SOURCE_NAME ?? "",
  },
};
