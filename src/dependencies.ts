import InMemoryDriver from './infra/drivers/db/InMemoryDriver'
import CryptoDriver from './infra/drivers/hash/CryptoDriver'
import JwtDriver from './infra/drivers/token/JwtDriver'
import InMemoryUserRepository from './adapters/repositories/inMemory/InMemoryUserRepository'
import RegisterCustomerSchema from './infra/schemas/auth/RegisterCustomerSchema'
import AuthenticateUserSchema from './infra/schemas/auth/AuthenticateUserSchema'
import RefreshAccessTokenSchema from './infra/schemas/auth/RefreshAccessTokenSchema'
import CreateAdminSchema from './infra/schemas/user/CreateAdminSchema'
import FindUsersSchema from './infra/schemas/user/FindUsersSchema'
import FindUserByIdSchema from './infra/schemas/user/FindUserByIdSchema'
import UpdateUserSchema from './infra/schemas/user/UpdateUserSchema'
import UpdateUserPasswordSchema from './infra/schemas/user/UpdateUserPasswordSchema'
import DeleteUserSchema from './infra/schemas/user/DeleteUserSchema'
import RegisterCustomer from './application/useCases/auth/RegisterCustomer'
import AuthenticateUser from './application/useCases/auth/AuthenticateUser'
import ValidateAuthentication from './application/useCases/auth/ValidateAuthentication'
import CreateAdmin from './application/useCases/user/CreateAdmin'
import FindUsers from './application/useCases/user/FindUsers'
import FindUserById from './application/useCases/user/FindUserById'
import UpdateUser from './application/useCases/user/UpdateUser'
import UpdateUserPassword from './application/useCases/user/UpdateUserPassword'
import DeleteUser from './application/useCases/user/DeleteUser'
import ValidateAuthenticationMiddleware from './adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import RegisterCustomerController from './adapters/controllers/auth/RegisterCustomerController'
import AuthenticateUserController from './adapters/controllers/auth/AuthenticateUserController'
import CreateAdminController from './adapters/controllers/user/CreateAdminController'
import FindUsersController from './adapters/controllers/user/FindUsersController'
import FindUserByIdController from './adapters/controllers/user/FindUserByIdController'
import UpdateUserController from './adapters/controllers/user/UpdateUserController'
import UpdateUserPasswordController from './adapters/controllers/user/UpdateUserPasswordController'
import DeleteUserController from './adapters/controllers/user/DeleteUserController'
import CustomerPresenter from './adapters/presenters/user/CustomerPresenter'
import AdminPresenter from './adapters/presenters/user/AdminPresenter'
import ValidateAuthorization from './application/useCases/auth/ValidateAuthorization'
import ValidateAuthorizationMiddleware from './adapters/middlewares/auth/ValidateAuthorizationMiddleware'
import InMemoryRefreshTokenRepository from './adapters/repositories/inMemory/InMemoryRefreshTokenRepository'
import RefreshAccessTokenController from './adapters/controllers/auth/RefreshAccessTokenController'
import RefreshAccessToken from './application/useCases/auth/RefreshAccessToken'
import LogoutSchema from './infra/schemas/auth/LogoutSchema'
import DeleteRefreshToken from './application/useCases/auth/DeleteRefreshToken'
import LogoutController from './adapters/controllers/auth/LogoutController'
import { UserMapper } from './domain/mappers/UserMapper'
import { RefreshTokenMapper } from './domain/mappers/RefreshTokenMapper'

export default (config: any) => {
  const {
    accessTokenSecret,
    accessTokenExpirationTime,
    refreshTokenSecret,
    refreshTokenExpirationTime,
  } = config
  // Drivers
  const cryptoDriver = new CryptoDriver()
  const jwtDriver = new JwtDriver(accessTokenSecret, accessTokenExpirationTime, refreshTokenSecret, refreshTokenExpirationTime)
  // Mappers
  const userMapper = new UserMapper()
  const refreshTokenMapper = new RefreshTokenMapper()
  // Repositories
  const inMemoryUserRepository = new InMemoryUserRepository(new InMemoryDriver(), userMapper)
  const inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository(new InMemoryDriver(), refreshTokenMapper)
  // Use Cases
  const registerCustomerUseCase = new RegisterCustomer(inMemoryUserRepository, cryptoDriver)
  const authenticateUserUseCase = new AuthenticateUser(inMemoryUserRepository, inMemoryRefreshTokenRepository, jwtDriver, cryptoDriver)
  const refreshAccessTokenUseCase = new RefreshAccessToken(jwtDriver, inMemoryRefreshTokenRepository)
  const deleteRefreshTokenUseCase = new DeleteRefreshToken(inMemoryRefreshTokenRepository)
  const validateAuthenticationUseCase = new ValidateAuthentication(jwtDriver, inMemoryRefreshTokenRepository)
  const validateAuthorizationUseCase = new ValidateAuthorization()
  const createAdminUseCase = new CreateAdmin(inMemoryUserRepository, cryptoDriver)
  const findUsersUseCase = new FindUsers(inMemoryUserRepository)
  const findUserByIdUseCase = new FindUserById(inMemoryUserRepository)
  const updateUserUseCase = new UpdateUser(inMemoryUserRepository, inMemoryRefreshTokenRepository)
  const updateUserPasswordUseCase = new UpdateUserPassword(cryptoDriver, inMemoryUserRepository, inMemoryRefreshTokenRepository)
  const deleteUserUseCase = new DeleteUser(inMemoryUserRepository, inMemoryRefreshTokenRepository)
  // Middlewares
  const validateAuthenticationMiddleware = new ValidateAuthenticationMiddleware(validateAuthenticationUseCase)
  const validateAuthorizationMiddleware = new ValidateAuthorizationMiddleware(validateAuthorizationUseCase)
  // Controllers
  const registerCustomerController = new RegisterCustomerController(registerCustomerUseCase, RegisterCustomerSchema)
  const authenticateUserController = new AuthenticateUserController(authenticateUserUseCase, AuthenticateUserSchema)
  const refreshAccessTokenController = new RefreshAccessTokenController(refreshAccessTokenUseCase, RefreshAccessTokenSchema)
  const logoutController = new LogoutController(deleteRefreshTokenUseCase, LogoutSchema)
  const createAdminController = new CreateAdminController(createAdminUseCase, CreateAdminSchema)
  const findUsersController = new FindUsersController(findUsersUseCase, FindUsersSchema)
  const findUserByIdController = new FindUserByIdController(findUserByIdUseCase, FindUserByIdSchema)
  const updateUserController = new UpdateUserController(updateUserUseCase, UpdateUserSchema)
  const updateUserPasswordController = new UpdateUserPasswordController(updateUserPasswordUseCase, UpdateUserPasswordSchema)
  const deleteUserController = new DeleteUserController(deleteUserUseCase, DeleteUserSchema)
  // Presenters
  const customerPresenter = new CustomerPresenter()
  const adminPresenter = new AdminPresenter()
  
  createAdminUseCase.exec({
    email: 'admin@email.com',
    password: '12345',
  })

  return {
    middlewares: {
      validateAuthenticationMiddleware,
      validateAuthorizationMiddleware,
    },
    controllers: {
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
    },
    presenters: {
      customerPresenter,
      adminPresenter,
    }
  }
}
