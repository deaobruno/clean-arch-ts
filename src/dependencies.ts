import config from "./config";
import InMemoryDriver from "./infra/drivers/db/InMemoryDriver";
import CryptoDriver from "./infra/drivers/hash/CryptoDriver";
import JwtDriver from "./infra/drivers/token/JwtDriver";
import InMemoryUserRepository from "./adapters/repositories/inMemory/InMemoryUserRepository";
import RegisterCustomerSchema from "./infra/schemas/auth/RegisterCustomerSchema";
import AuthenticateUserSchema from "./infra/schemas/auth/AuthenticateUserSchema";
import RefreshAccessTokenSchema from "./infra/schemas/auth/RefreshAccessTokenSchema";
import CreateAdminSchema from "./infra/schemas/user/CreateAdminSchema";
import FindUsersSchema from "./infra/schemas/user/FindUsersSchema";
import FindUserByIdSchema from "./infra/schemas/user/FindUserByIdSchema";
import UpdateUserSchema from "./infra/schemas/user/UpdateUserSchema";
import UpdateUserPasswordSchema from "./infra/schemas/user/UpdateUserPasswordSchema";
import DeleteUserSchema from "./infra/schemas/user/DeleteUserSchema";
import RegisterCustomer from "./application/useCases/auth/RegisterCustomer";
import AuthenticateUser from "./application/useCases/auth/AuthenticateUser";
import ValidateAuthentication from "./application/useCases/auth/ValidateAuthentication";
import CreateAdmin from "./application/useCases/user/CreateAdmin";
import FindUsers from "./application/useCases/user/FindUsers";
import FindUserById from "./application/useCases/user/FindUserById";
import UpdateUser from "./application/useCases/user/UpdateUser";
import UpdateUserPassword from "./application/useCases/user/UpdateUserPassword";
import DeleteUser from "./application/useCases/user/DeleteUser";
import RegisterCustomerController from "./adapters/controllers/auth/RegisterCustomerController";
import AuthenticateUserController from "./adapters/controllers/auth/AuthenticateUserController";
import CreateAdminController from "./adapters/controllers/user/CreateAdminController";
import FindUsersController from "./adapters/controllers/user/FindUsersController";
import FindUserByIdController from "./adapters/controllers/user/FindUserByIdController";
import UpdateUserController from "./adapters/controllers/user/UpdateUserController";
import UpdateUserPasswordController from "./adapters/controllers/user/UpdateUserPasswordController";
import DeleteUserController from "./adapters/controllers/user/DeleteUserController";
import CustomerPresenter from "./adapters/presenters/user/CustomerPresenter";
import AdminPresenter from "./adapters/presenters/user/AdminPresenter";
import ValidateAuthorization from "./application/useCases/auth/ValidateAuthorization";
import InMemoryRefreshTokenRepository from "./adapters/repositories/inMemory/InMemoryRefreshTokenRepository";
import RefreshAccessTokenController from "./adapters/controllers/auth/RefreshAccessTokenController";
import RefreshAccessToken from "./application/useCases/auth/RefreshAccessToken";
import LogoutSchema from "./infra/schemas/auth/LogoutSchema";
import DeleteRefreshToken from "./application/useCases/auth/DeleteRefreshToken";
import LogoutController from "./adapters/controllers/auth/LogoutController";
import UserMapper from "./domain/user/UserMapper";
import RefreshTokenMapper from "./domain/refreshToken/RefreshTokenMapper";
import CreateRoot from "./application/useCases/user/CreateRoot";

const {
  app: {
    rootUserEmail,
    rootUserPassword,
    accessTokenSecret,
    accessTokenExpirationTime,
    refreshTokenSecret,
    refreshTokenExpirationTime,
  },
  db: { usersSource, refreshTokensSource },
} = config;
// Drivers
const dbDriver = InMemoryDriver.getInstance();
const cryptoDriver = new CryptoDriver();
const jwtDriver = new JwtDriver(
  accessTokenSecret,
  accessTokenExpirationTime,
  refreshTokenSecret,
  refreshTokenExpirationTime
);
// Mappers
const userMapper = new UserMapper();
const refreshTokenMapper = new RefreshTokenMapper();
// Repositories
const inMemoryUserRepository = new InMemoryUserRepository(
  usersSource,
  dbDriver,
  userMapper
);
const inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository(
  refreshTokensSource,
  dbDriver,
  refreshTokenMapper
);
// Use Cases
const registerCustomerUseCase = new RegisterCustomer(
  inMemoryUserRepository,
  cryptoDriver
);
const authenticateUserUseCase = new AuthenticateUser(
  inMemoryUserRepository,
  inMemoryRefreshTokenRepository,
  jwtDriver,
  cryptoDriver
);
const refreshAccessTokenUseCase = new RefreshAccessToken(
  jwtDriver,
  inMemoryRefreshTokenRepository
);
const deleteRefreshTokenUseCase = new DeleteRefreshToken(
  inMemoryRefreshTokenRepository
);
const validateAuthenticationUseCase = new ValidateAuthentication(
  jwtDriver,
  inMemoryRefreshTokenRepository
);
const validateAuthorizationUseCase = new ValidateAuthorization();
const createRootUseCase = new CreateRoot(inMemoryUserRepository, cryptoDriver);
const createAdminUseCase = new CreateAdmin(
  inMemoryUserRepository,
  cryptoDriver
);
const findUsersUseCase = new FindUsers(inMemoryUserRepository);
const findUserByIdUseCase = new FindUserById(inMemoryUserRepository);
const updateUserUseCase = new UpdateUser(
  inMemoryUserRepository,
  inMemoryRefreshTokenRepository
);
const updateUserPasswordUseCase = new UpdateUserPassword(
  cryptoDriver,
  inMemoryUserRepository,
  inMemoryRefreshTokenRepository
);
const deleteUserUseCase = new DeleteUser(
  inMemoryUserRepository,
  inMemoryRefreshTokenRepository
);
// Presenters
const customerPresenter = new CustomerPresenter();
const adminPresenter = new AdminPresenter();
// Controllers
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
const createAdminController = new CreateAdminController({
  useCase: createAdminUseCase,
  schema: CreateAdminSchema,
  validateAuthenticationUseCase,
  validateAuthorizationUseCase,
  presenter: adminPresenter,
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

createRootUseCase.exec({
  email: rootUserEmail,
  password: rootUserPassword,
});

export default {
  registerCustomerController,
  authenticateUserController,
  refreshAccessTokenController,
  logoutController,
  createAdminController,
  findUsersController,
  findUserByIdController,
  updateUserController,
  updateUserPasswordController,
  deleteUserController,
};
