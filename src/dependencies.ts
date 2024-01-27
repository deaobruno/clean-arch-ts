import config from "./config";
import CryptoDriver from "./infra/drivers/hash/CryptoDriver";
import JwtDriver from "./infra/drivers/token/JwtDriver";
import UserRepository from "./adapters/repositories/UserRepository";
import RegisterCustomerSchema from "./infra/schemas/auth/RegisterCustomerSchema";
import AuthenticateUserSchema from "./infra/schemas/auth/AuthenticateUserSchema";
import RefreshAccessTokenSchema from "./infra/schemas/auth/RefreshAccessTokenSchema";
import FindUsersSchema from "./infra/schemas/user/FindUsersSchema";
import FindUserByIdSchema from "./infra/schemas/user/FindUserByIdSchema";
import UpdateUserSchema from "./infra/schemas/user/UpdateUserSchema";
import UpdateUserPasswordSchema from "./infra/schemas/user/UpdateUserPasswordSchema";
import DeleteUserSchema from "./infra/schemas/user/DeleteUserSchema";
import CreateMemoSchema from "./infra/schemas/memo/CreateMemoSchema";
import FindMemoByIdSchema from "./infra/schemas/memo/FindMemoByIdSchema";
import FindMemosByUserIdSchema from "./infra/schemas/memo/FindMemosByUserIdSchema";
import UpdateMemoSchema from "./infra/schemas/memo/UpdateMemoSchema";
import DeleteMemoSchema from "./infra/schemas/memo/DeleteMemoSchema";
import RegisterCustomer from "./application/useCases/auth/RegisterCustomer";
import AuthenticateUser from "./application/useCases/auth/AuthenticateUser";
import ValidateAuthentication from "./application/useCases/auth/ValidateAuthentication";
import FindUsers from "./application/useCases/user/FindUsers";
import FindUserById from "./application/useCases/user/FindUserById";
import UpdateUser from "./application/useCases/user/UpdateUser";
import UpdateUserPassword from "./application/useCases/user/UpdateUserPassword";
import DeleteUser from "./application/useCases/user/DeleteUser";
import RegisterCustomerController from "./adapters/controllers/auth/RegisterCustomerController";
import AuthenticateUserController from "./adapters/controllers/auth/AuthenticateUserController";
import FindUsersController from "./adapters/controllers/user/FindUsersController";
import FindUserByIdController from "./adapters/controllers/user/FindUserByIdController";
import UpdateUserController from "./adapters/controllers/user/UpdateUserController";
import UpdateUserPasswordController from "./adapters/controllers/user/UpdateUserPasswordController";
import DeleteUserController from "./adapters/controllers/user/DeleteUserController";
import CustomerPresenter from "./adapters/presenters/user/CustomerPresenter";
import AdminPresenter from "./adapters/presenters/user/AdminPresenter";
import MemoPresenter from "./adapters/presenters/memo/MemoPresenter";
import ValidateAuthorization from "./application/useCases/auth/ValidateAuthorization";
import RefreshTokenRepository from "./adapters/repositories/RefreshTokenRepository";
import RefreshAccessTokenController from "./adapters/controllers/auth/RefreshAccessTokenController";
import RefreshAccessToken from "./application/useCases/auth/RefreshAccessToken";
import LogoutSchema from "./infra/schemas/auth/LogoutSchema";
import DeleteRefreshToken from "./application/useCases/auth/Logout";
import LogoutController from "./adapters/controllers/auth/LogoutController";
import UserMapper from "./domain/user/UserMapper";
import RefreshTokenMapper from "./domain/refreshToken/RefreshTokenMapper";
import CreateRoot from "./application/useCases/user/CreateRoot";
import PinoDriver from "./infra/drivers/logger/PinoDriver";
import MongoDbDriver from "./infra/drivers/db/MongoDbDriver";
import CreateRootUserEvent from "./adapters/events/user/CreateRootUserEvent";
import MemoMapper from "./domain/memo/MemoMapper";
import MemoRepository from "./adapters/repositories/MemoRepository";
import CreateMemo from "./application/useCases/memo/CreateMemo";
import FindMemoById from "./application/useCases/memo/FindMemoById";
import FindMemosByUserId from "./application/useCases/memo/FindMemosByUserId";
import UpdateMemo from "./application/useCases/memo/UpdateMemo";
import DeleteMemo from "./application/useCases/memo/DeleteMemo";
import CreateMemoController from "./adapters/controllers/memo/CreateMemoController";
import FindMemoByIdController from "./adapters/controllers/memo/FindMemoByIdController";
import FindMemosByUserIdController from "./adapters/controllers/memo/FindMemosByUserIdController";
import UpdateMemoController from "./adapters/controllers/memo/UpdateMemoController";
import DeleteMemoController from "./adapters/controllers/memo/DeleteMemoController";
import NodeCacheDriver from "./infra/drivers/cache/NodeCacheDriver";

const {
  app: {
    accessTokenSecret,
    accessTokenExpirationTime,
    refreshTokenSecret,
    refreshTokenExpirationTime,
  },
  db: {
    mongo: { dbName },
    usersSource,
    refreshTokensSource,
    memoSource,
  },
} = config;
// DRIVERS
const dbDriver = MongoDbDriver.getInstance(dbName);
const cryptoDriver = new CryptoDriver();
const jwtDriver = new JwtDriver(
  accessTokenSecret,
  accessTokenExpirationTime,
  refreshTokenSecret,
  refreshTokenExpirationTime
);
const loggerDriver = new PinoDriver();
const cacheDriver = new NodeCacheDriver();
// MAPPERS
const userMapper = new UserMapper();
const refreshTokenMapper = new RefreshTokenMapper();
const memoMapper = new MemoMapper();
// REPOSITORIES
const memoRepository = new MemoRepository(
  memoSource,
  dbDriver,
  cacheDriver,
  memoMapper
);
const userRepository = new UserRepository(
  usersSource,
  dbDriver,
  cacheDriver,
  userMapper
);
const refreshTokenRepository = new RefreshTokenRepository(
  refreshTokensSource,
  dbDriver,
  cacheDriver,
  refreshTokenMapper,
  refreshTokenExpirationTime
);
// USE CASES
const registerCustomerUseCase = new RegisterCustomer(
  userRepository,
  cryptoDriver
);
const authenticateUserUseCase = new AuthenticateUser(
  userRepository,
  refreshTokenRepository,
  jwtDriver,
  cryptoDriver
);
const refreshAccessTokenUseCase = new RefreshAccessToken(
  jwtDriver,
  refreshTokenRepository
);
const deleteRefreshTokenUseCase = new DeleteRefreshToken(
  refreshTokenRepository
);
const validateAuthenticationUseCase = new ValidateAuthentication(
  jwtDriver,
  refreshTokenRepository,
  userRepository
);
const validateAuthorizationUseCase = new ValidateAuthorization();
const createRootUseCase = new CreateRoot(userRepository, cryptoDriver);
const findUsersUseCase = new FindUsers(userRepository);
const findUserByIdUseCase = new FindUserById(userRepository);
const updateUserUseCase = new UpdateUser(
  userRepository,
  refreshTokenRepository
);
const updateUserPasswordUseCase = new UpdateUserPassword(
  cryptoDriver,
  userRepository,
  refreshTokenRepository
);
const deleteUserUseCase = new DeleteUser(
  userRepository,
  refreshTokenRepository,
  memoRepository
);
const createMemoUseCase = new CreateMemo(cryptoDriver, memoRepository);
const findMemoByIdUseCase = new FindMemoById(memoRepository);
const findMemosByUserIdUseCase = new FindMemosByUserId(memoRepository);
const updateMemoUseCase = new UpdateMemo(memoRepository);
const deleteMemoUseCase = new DeleteMemo(memoRepository);
// PRESENTERS
const customerPresenter = new CustomerPresenter();
const adminPresenter = new AdminPresenter();
const memoPresenter = new MemoPresenter();
// CONTROLLERS
const registerCustomerController = new RegisterCustomerController({
  useCase: registerCustomerUseCase,
  schema: RegisterCustomerSchema,
  presenter: customerPresenter,
});
const authenticateUserController = new AuthenticateUserController({
  useCase: authenticateUserUseCase,
  schema: AuthenticateUserSchema,
});
const refreshAccessTokenController = new RefreshAccessTokenController({
  useCase: refreshAccessTokenUseCase,
  schema: RefreshAccessTokenSchema,
  validateAuthenticationUseCase,
});
const logoutController = new LogoutController({
  useCase: deleteRefreshTokenUseCase,
  schema: LogoutSchema,
  validateAuthenticationUseCase,
});
const findUsersController = new FindUsersController({
  useCase: findUsersUseCase,
  schema: FindUsersSchema,
  validateAuthenticationUseCase,
  validateAuthorizationUseCase,
  presenter: adminPresenter,
});
const findUserByIdController = new FindUserByIdController({
  useCase: findUserByIdUseCase,
  schema: FindUserByIdSchema,
  validateAuthenticationUseCase,
  presenter: customerPresenter,
});
const updateUserController = new UpdateUserController({
  useCase: updateUserUseCase,
  schema: UpdateUserSchema,
  validateAuthenticationUseCase,
  presenter: customerPresenter,
});
const updateUserPasswordController = new UpdateUserPasswordController({
  useCase: updateUserPasswordUseCase,
  schema: UpdateUserPasswordSchema,
  validateAuthenticationUseCase,
  presenter: customerPresenter,
});
const deleteUserController = new DeleteUserController({
  useCase: deleteUserUseCase,
  schema: DeleteUserSchema,
  validateAuthenticationUseCase,
  validateAuthorizationUseCase,
});
const createMemoController = new CreateMemoController({
  useCase: createMemoUseCase,
  schema: CreateMemoSchema,
  validateAuthenticationUseCase,
  presenter: memoPresenter,
});
const findMemoByIdController = new FindMemoByIdController({
  useCase: findMemoByIdUseCase,
  schema: FindMemoByIdSchema,
  validateAuthenticationUseCase,
  presenter: memoPresenter,
});
const findMemosByUserIdController = new FindMemosByUserIdController({
  useCase: findMemosByUserIdUseCase,
  schema: FindMemosByUserIdSchema,
  validateAuthenticationUseCase,
  presenter: memoPresenter,
});
const updateMemoController = new UpdateMemoController({
  useCase: updateMemoUseCase,
  schema: UpdateMemoSchema,
  validateAuthenticationUseCase,
  presenter: memoPresenter,
});
const deleteMemoController = new DeleteMemoController({
  useCase: deleteMemoUseCase,
  schema: DeleteMemoSchema,
  validateAuthenticationUseCase,
  validateAuthorizationUseCase,
});
// EVENTS
const createRootUserEvent = new CreateRootUserEvent(createRootUseCase);

export default {
  dbDriver,
  loggerDriver,
  registerCustomerController,
  authenticateUserController,
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
