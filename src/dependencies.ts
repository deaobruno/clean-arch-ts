import config from './config';
import CryptoDriver from './infra/drivers/hash/CryptoDriver';
import JwtDriver from './infra/drivers/token/JwtDriver';
import UserRepository from './adapters/repositories/UserRepository';
import RegisterCustomerSchema from './infra/schemas/auth/RegisterCustomerSchema';
import LoginSchema from './infra/schemas/auth/LoginSchema';
import RefreshAccessTokenSchema from './infra/schemas/auth/RefreshAccessTokenSchema';
import FindUsersSchema from './infra/schemas/user/FindUsersSchema';
import FindUserByIdSchema from './infra/schemas/user/FindUserByIdSchema';
import UpdateUserSchema from './infra/schemas/user/UpdateUserSchema';
import UpdateUserPasswordSchema from './infra/schemas/user/UpdateUserPasswordSchema';
import DeleteUserSchema from './infra/schemas/user/DeleteUserSchema';
import CreateMemoSchema from './infra/schemas/memo/CreateMemoSchema';
import FindMemoByIdSchema from './infra/schemas/memo/FindMemoByIdSchema';
import FindMemosByUserIdSchema from './infra/schemas/memo/FindMemosByUserIdSchema';
import UpdateMemoSchema from './infra/schemas/memo/UpdateMemoSchema';
import DeleteMemoSchema from './infra/schemas/memo/DeleteMemoSchema';
import RegisterCustomer from './application/useCases/auth/RegisterCustomer';
import Login from './application/useCases/auth/Login';
import ValidateAuthentication from './application/useCases/auth/ValidateAuthentication';
import FindUsers from './application/useCases/user/FindUsers';
import FindUserById from './application/useCases/user/FindUserById';
import UpdateUser from './application/useCases/user/UpdateUser';
import UpdateUserPassword from './application/useCases/user/UpdateUserPassword';
import DeleteUser from './application/useCases/user/DeleteUser';
import RegisterCustomerController from './adapters/controllers/auth/RegisterCustomerController';
import LoginController from './adapters/controllers/auth/LoginController';
import FindUsersController from './adapters/controllers/user/FindUsersController';
import FindUserByIdController from './adapters/controllers/user/FindUserByIdController';
import UpdateUserController from './adapters/controllers/user/UpdateUserController';
import UpdateUserPasswordController from './adapters/controllers/user/UpdateUserPasswordController';
import DeleteUserController from './adapters/controllers/user/DeleteUserController';
import CustomerPresenter from './adapters/presenters/user/CustomerPresenter';
import AdminPresenter from './adapters/presenters/user/AdminPresenter';
import MemoPresenter from './adapters/presenters/memo/MemoPresenter';
import ValidateAuthorization from './application/useCases/auth/ValidateAuthorization';
import RefreshTokenRepository from './adapters/repositories/RefreshTokenRepository';
import RefreshAccessTokenController from './adapters/controllers/auth/RefreshAccessTokenController';
import RefreshAccessToken from './application/useCases/auth/RefreshAccessToken';
import LogoutSchema from './infra/schemas/auth/LogoutSchema';
import DeleteRefreshToken from './application/useCases/auth/Logout';
import LogoutController from './adapters/controllers/auth/LogoutController';
import UserMapper from './domain/user/UserMapper';
import RefreshTokenMapper from './domain/refreshToken/RefreshTokenMapper';
import CreateRoot from './application/useCases/user/CreateRoot';
import PinoDriver from './infra/drivers/logger/PinoDriver';
import MongoDbDriver from './infra/drivers/db/MongoDbDriver';
import CreateRootUserEvent from './adapters/events/user/CreateRootUserEvent';
import MemoMapper from './domain/memo/MemoMapper';
import MemoRepository from './adapters/repositories/MemoRepository';
import CreateMemo from './application/useCases/memo/CreateMemo';
import FindMemoById from './application/useCases/memo/FindMemoById';
import FindMemosByUserId from './application/useCases/memo/FindMemosByUserId';
import UpdateMemo from './application/useCases/memo/UpdateMemo';
import DeleteMemo from './application/useCases/memo/DeleteMemo';
import CreateMemoController from './adapters/controllers/memo/CreateMemoController';
import FindMemoByIdController from './adapters/controllers/memo/FindMemoByIdController';
import FindMemosByUserIdController from './adapters/controllers/memo/FindMemosByUserIdController';
import UpdateMemoController from './adapters/controllers/memo/UpdateMemoController';
import DeleteMemoController from './adapters/controllers/memo/DeleteMemoController';
import RedisDriver from './infra/drivers/cache/RedisDriver';
import BcryptDriver from './infra/drivers/encryption/BcryptDriver';
import IDbDriver from './infra/drivers/db/IDbDriver';
import IDbMemo from './domain/memo/IDbMemo';
import IDbUser from './domain/user/IDbUser';
import IDbRefreshToken from './domain/refreshToken/IDbRefreshToken';

const {
  app: {
    environment,
    accessTokenSecret,
    accessTokenExpirationTime,
    refreshTokenSecret,
    refreshTokenExpirationTime,
  },
  db: {
    mongo: { dbUrl, dbName },
    usersSource,
    refreshTokensSource,
    memoSource,
  },
  cache: {
    redis: { url: redisUrl, password: redisPassword },
  },
} = config;
const loggerLevel = environment === 'debug' ? 'debug' : 'info';
// DRIVERS
const loggerDriver = new PinoDriver(loggerLevel);
const dbDriver = MongoDbDriver.getInstance(dbUrl, dbName, loggerDriver);
const hashDriver = new CryptoDriver(loggerDriver);
const tokenDriver = new JwtDriver(
  loggerDriver,
  accessTokenSecret,
  accessTokenExpirationTime,
  refreshTokenSecret,
  refreshTokenExpirationTime,
);
const cacheDriver = new RedisDriver(redisUrl, redisPassword, loggerDriver);
const encryptionDriver = new BcryptDriver(loggerDriver);
// MAPPERS
const userMapper = new UserMapper(loggerDriver);
const refreshTokenMapper = new RefreshTokenMapper(loggerDriver);
const memoMapper = new MemoMapper(loggerDriver);
// REPOSITORIES
const memoRepository = new MemoRepository(
  memoSource,
  loggerDriver,
  <IDbDriver<IDbMemo>>dbDriver,
  cacheDriver,
  memoMapper,
);
const userRepository = new UserRepository(
  usersSource,
  loggerDriver,
  <IDbDriver<IDbUser>>dbDriver,
  cacheDriver,
  userMapper,
);
const refreshTokenRepository = new RefreshTokenRepository(
  refreshTokensSource,
  loggerDriver,
  <IDbDriver<IDbRefreshToken>>dbDriver,
  cacheDriver,
  refreshTokenMapper,
  refreshTokenExpirationTime,
);
// USE CASES
const registerCustomerUseCase = new RegisterCustomer(
  loggerDriver,
  hashDriver,
  encryptionDriver,
  userRepository,
);
const loginUseCase = new Login(
  loggerDriver,
  encryptionDriver,
  tokenDriver,
  userRepository,
  refreshTokenRepository,
);
const refreshAccessTokenUseCase = new RefreshAccessToken(
  loggerDriver,
  tokenDriver,
  refreshTokenRepository,
);
const deleteRefreshTokenUseCase = new DeleteRefreshToken(
  loggerDriver,
  refreshTokenRepository,
);
const validateAuthenticationUseCase = new ValidateAuthentication(
  loggerDriver,
  tokenDriver,
  refreshTokenRepository,
  userRepository,
);
const validateAuthorizationUseCase = new ValidateAuthorization(loggerDriver);
const createRootUseCase = new CreateRoot(
  loggerDriver,
  hashDriver,
  encryptionDriver,
  userRepository,
);
const findUsersUseCase = new FindUsers(loggerDriver, userRepository);
const findUserByIdUseCase = new FindUserById(loggerDriver, userRepository);
const updateUserUseCase = new UpdateUser(
  loggerDriver,
  userRepository,
  refreshTokenRepository,
);
const updateUserPasswordUseCase = new UpdateUserPassword(
  loggerDriver,
  encryptionDriver,
  userRepository,
  refreshTokenRepository,
);
const deleteUserUseCase = new DeleteUser(
  loggerDriver,
  userRepository,
  refreshTokenRepository,
  memoRepository,
);
const createMemoUseCase = new CreateMemo(
  loggerDriver,
  hashDriver,
  memoRepository,
);
const findMemoByIdUseCase = new FindMemoById(loggerDriver, memoRepository);
const findMemosByUserIdUseCase = new FindMemosByUserId(
  loggerDriver,
  memoRepository,
);
const updateMemoUseCase = new UpdateMemo(loggerDriver, memoRepository);
const deleteMemoUseCase = new DeleteMemo(loggerDriver, memoRepository);
// PRESENTERS
const customerPresenter = new CustomerPresenter(loggerDriver);
const adminPresenter = new AdminPresenter(loggerDriver);
const memoPresenter = new MemoPresenter(loggerDriver);
// CONTROLLERS
const registerCustomerController = new RegisterCustomerController({
  logger: loggerDriver,
  useCase: registerCustomerUseCase,
  schema: RegisterCustomerSchema,
  presenter: customerPresenter,
});
const loginController = new LoginController({
  logger: loggerDriver,
  useCase: loginUseCase,
  schema: LoginSchema,
});
const refreshAccessTokenController = new RefreshAccessTokenController({
  logger: loggerDriver,
  useCase: refreshAccessTokenUseCase,
  schema: RefreshAccessTokenSchema,
  validateAuthenticationUseCase,
});
const logoutController = new LogoutController({
  logger: loggerDriver,
  useCase: deleteRefreshTokenUseCase,
  schema: LogoutSchema,
  validateAuthenticationUseCase,
});
const findUsersController = new FindUsersController({
  logger: loggerDriver,
  useCase: findUsersUseCase,
  schema: FindUsersSchema,
  validateAuthenticationUseCase,
  validateAuthorizationUseCase,
  presenter: adminPresenter,
});
const findUserByIdController = new FindUserByIdController({
  logger: loggerDriver,
  useCase: findUserByIdUseCase,
  schema: FindUserByIdSchema,
  validateAuthenticationUseCase,
  presenter: customerPresenter,
});
const updateUserController = new UpdateUserController({
  logger: loggerDriver,
  useCase: updateUserUseCase,
  schema: UpdateUserSchema,
  validateAuthenticationUseCase,
  presenter: customerPresenter,
});
const updateUserPasswordController = new UpdateUserPasswordController({
  logger: loggerDriver,
  useCase: updateUserPasswordUseCase,
  schema: UpdateUserPasswordSchema,
  validateAuthenticationUseCase,
  presenter: customerPresenter,
});
const deleteUserController = new DeleteUserController({
  logger: loggerDriver,
  useCase: deleteUserUseCase,
  schema: DeleteUserSchema,
  validateAuthenticationUseCase,
  validateAuthorizationUseCase,
});
const createMemoController = new CreateMemoController({
  logger: loggerDriver,
  useCase: createMemoUseCase,
  schema: CreateMemoSchema,
  validateAuthenticationUseCase,
  presenter: memoPresenter,
});
const findMemoByIdController = new FindMemoByIdController({
  logger: loggerDriver,
  useCase: findMemoByIdUseCase,
  schema: FindMemoByIdSchema,
  validateAuthenticationUseCase,
  presenter: memoPresenter,
});
const findMemosByUserIdController = new FindMemosByUserIdController({
  logger: loggerDriver,
  useCase: findMemosByUserIdUseCase,
  schema: FindMemosByUserIdSchema,
  validateAuthenticationUseCase,
  presenter: memoPresenter,
});
const updateMemoController = new UpdateMemoController({
  logger: loggerDriver,
  useCase: updateMemoUseCase,
  schema: UpdateMemoSchema,
  validateAuthenticationUseCase,
  presenter: memoPresenter,
});
const deleteMemoController = new DeleteMemoController({
  logger: loggerDriver,
  useCase: deleteMemoUseCase,
  schema: DeleteMemoSchema,
  validateAuthenticationUseCase,
  validateAuthorizationUseCase,
});
// EVENTS
const createRootUserEvent = new CreateRootUserEvent(
  loggerDriver,
  createRootUseCase,
);

export default {
  dbDriver,
  loggerDriver,
  cacheDriver,
  hashDriver,
  registerCustomerController,
  loginController,
  refreshAccessTokenController,
  logoutController,
  findUsersController,
  findUserByIdController,
  updateUserController,
  updateUserPasswordController,
  deleteUserController,
  createMemoController,
  findMemoByIdController,
  findMemosByUserIdController,
  updateMemoController,
  deleteMemoController,
  createRootUserEvent,
};
