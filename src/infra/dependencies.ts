import config from './config'
import InMemoryDriver from './drivers/db/InMemoryDriver'
import CryptoDriver from './drivers/hash/CryptoDriver'
import JwtDriver from './drivers/token/JwtDriver'
import InMemoryUserRepository from '../adapters/repositories/inMemory/InMemoryUserRepository'
import RegisterCustomerSchema from './schemas/auth/RegisterCustomerSchema'
import AuthenticateUserSchema from './schemas/auth/AuthenticateUserSchema'
import RefreshAccessTokenSchema from './schemas/auth/RefreshAccessTokenSchema'
import CreateAdminSchema from './schemas/user/CreateAdminSchema'
import FindUsersSchema from './schemas/user/FindUsersSchema'
import FindUserByIdSchema from './schemas/user/FindUserByIdSchema'
import UpdateUserSchema from './schemas/user/UpdateUserSchema'
import UpdateUserPasswordSchema from './schemas/user/UpdateUserPasswordSchema'
import DeleteUserSchema from './schemas/user/DeleteUserSchema'
import ValidateInput from '../application/useCases/validation/ValidateInput'
import RegisterCustomer from '../application/useCases/auth/RegisterCustomer'
import AuthenticateUser from '../application/useCases/auth/AuthenticateUser'
import ValidateAuthentication from '../application/useCases/auth/ValidateAuthentication'
import CreateAdmin from '../application/useCases/user/CreateAdmin'
import FindUsers from '../application/useCases/user/FindUsers'
import FindUserById from '../application/useCases/user/FindUserById'
import UpdateUser from '../application/useCases/user/UpdateUser'
import UpdateUserPassword from '../application/useCases/user/UpdateUserPassword'
import DeleteUser from '../application/useCases/user/DeleteUser'
import ValidateInputMiddleware from '../adapters/middlewares/validation/ValidateInputMiddleware'
import ValidateAuthenticationMiddleware from '../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import RegisterCustomerController from '../adapters/controllers/auth/RegisterCustomerController'
import AuthenticateUserController from '../adapters/controllers/auth/AuthenticateUserController'
import CreateAdminController from '../adapters/controllers/user/CreateAdminController'
import FindUsersController from '../adapters/controllers/user/FindUsersController'
import FindUserByIdController from '../adapters/controllers/user/FindUserByIdController'
import UpdateUserController from '../adapters/controllers/user/UpdateUserController'
import UpdateUserPasswordController from '../adapters/controllers/user/UpdateUserPasswordController'
import DeleteUserController from '../adapters/controllers/user/DeleteUserController'
import CustomerPresenter from '../adapters/presenters/user/CustomerPresenter'
import AdminPresenter from '../adapters/presenters/user/AdminPresenter'
import ValidateAuthorization from '../application/useCases/auth/ValidateAuthorization'
import ValidateAuthorizationMiddleware from '../adapters/middlewares/auth/ValidateAuthorizationMiddleware'
import InMemoryRefreshTokenRepository from '../adapters/repositories/inMemory/InMemoryRefreshTokenRepository'
import RefreshAccessTokenController from '../adapters/controllers/auth/RefreshAccessTokenController'
import RefreshAccessToken from '../application/useCases/auth/RefreshAccessToken'
import LogoutSchema from './schemas/auth/LogoutSchema'
import DeleteRefreshToken from '../application/useCases/auth/DeleteRefreshToken'
import LogoutController from '../adapters/controllers/auth/LogoutController'
import { UserMapper } from '../domain/mappers/UserMapper'
import { RefreshTokenMapper } from '../domain/mappers/RefreshTokenMapper'

const {
  app: {
    accessTokenSecret,
    accessTokenExpirationTime,
    refreshTokenSecret,
    refreshTokenExpirationTime,
  }
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
const validateRegisterPayloadUseCase = new ValidateInput(RegisterCustomerSchema)
const validateAuthenticateUserPayloadUseCase = new ValidateInput(AuthenticateUserSchema)
const validateRefreshAccessTokenPayloadUseCase = new ValidateInput(RefreshAccessTokenSchema)
const validateLogoutPayloadUseCase = new ValidateInput(LogoutSchema)
const validateCreateAdminPayloadUseCase = new ValidateInput(CreateAdminSchema)
const validateFindUsersPayloadUseCase = new ValidateInput(FindUsersSchema)
const validateFindUserByIdPayloadUseCase = new ValidateInput(FindUserByIdSchema)
const validateUpdateUserPayloadUseCase = new ValidateInput(UpdateUserSchema)
const validateUpdateUserPasswordPayloadUseCase = new ValidateInput(UpdateUserPasswordSchema)
const validateDeleteUserPayloadUseCase = new ValidateInput(DeleteUserSchema)
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
const validateRegisterCustomerPayloadMiddleware = new ValidateInputMiddleware(validateRegisterPayloadUseCase)
const validateAuthenticateUserPayloadMiddleware = new ValidateInputMiddleware(validateAuthenticateUserPayloadUseCase)
const validateRefreshAccessTokenPayloadMiddleware = new ValidateInputMiddleware(validateRefreshAccessTokenPayloadUseCase)
const validateLogoutPayloadMiddleware = new ValidateInputMiddleware(validateLogoutPayloadUseCase)
const validateCreateAdminPayloadMiddleware = new ValidateInputMiddleware(validateCreateAdminPayloadUseCase)
const validateFindUsersPayloadMiddleware = new ValidateInputMiddleware(validateFindUsersPayloadUseCase)
const validateFindUserByIdPayloadMiddleware = new ValidateInputMiddleware(validateFindUserByIdPayloadUseCase)
const validateUpdateUserPayloadMiddleware = new ValidateInputMiddleware(validateUpdateUserPayloadUseCase)
const validateUpdateUserPasswordPayloadMiddleware = new ValidateInputMiddleware(validateUpdateUserPasswordPayloadUseCase)
const validateDeleteUserPayloadMiddleware = new ValidateInputMiddleware(validateDeleteUserPayloadUseCase)
// Controllers
const registerCustomerController = new RegisterCustomerController(registerCustomerUseCase)
const authenticateUserController = new AuthenticateUserController(authenticateUserUseCase)
const refreshAccessTokenController = new RefreshAccessTokenController(refreshAccessTokenUseCase)
const logoutController = new LogoutController(deleteRefreshTokenUseCase)
const createAdminController = new CreateAdminController(createAdminUseCase)
const findUsersController = new FindUsersController(findUsersUseCase)
const findUserByIdController = new FindUserByIdController(findUserByIdUseCase)
const updateUserController = new UpdateUserController(updateUserUseCase)
const updateUserPasswordController = new UpdateUserPasswordController(updateUserPasswordUseCase)
const deleteUserController = new DeleteUserController(deleteUserUseCase)
// Presenters
const customerPresenter = new CustomerPresenter()
const adminPresenter = new AdminPresenter()

createAdminUseCase.exec({
  email: 'admin@email.com',
  password: '12345',
})

export default {
  middlewares: {
    validateAuthenticationMiddleware,
    validateAuthorizationMiddleware,
    validateRegisterCustomerPayloadMiddleware,
    validateAuthenticateUserPayloadMiddleware,
    validateRefreshAccessTokenPayloadMiddleware,
    validateLogoutPayloadMiddleware,
    validateCreateAdminPayloadMiddleware,
    validateFindUsersPayloadMiddleware,
    validateFindUserByIdPayloadMiddleware,
    validateUpdateUserPayloadMiddleware,
    validateUpdateUserPasswordPayloadMiddleware,
    validateDeleteUserPayloadMiddleware,
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
