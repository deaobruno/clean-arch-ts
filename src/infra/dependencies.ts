import config from './config'
import InMemoryDriver from './drivers/InMemoryDriver'
import CryptoDriver from './drivers/CryptoDriver'
import JwtDriver from './drivers/JwtDriver'
import UserRepository from '../adapters/repositories/UserRepository'
import RegisterCustomerSchema from './schemas/auth/RegisterCustomerSchema'
import AuthenticateUserSchema from './schemas/auth/AuthenticateUserSchema'
import CreateAdminSchema from './schemas/user/CreateAdminSchema'
import FindUsersSchema from './schemas/user/FindUsersSchema'
import FindUserByIdSchema from './schemas/user/FindUserByIdSchema'
import UpdateUserSchema from './schemas/user/UpdateUserSchema'
import UpdateUserPasswordSchema from './schemas/user/UpdateUserPasswordSchema'
import DeleteUserSchema from './schemas/user/DeleteUserSchema'
import ValidateInput from '../application/use_cases/validation/ValidateInput'
import RegisterCustomer from '../application/use_cases/auth/RegisterCustomer'
import AuthenticateUser from '../application/use_cases/auth/AuthenticateUser'
import ValidateAuthentication from '../application/use_cases/auth/ValidateAuthentication'
import CreateAdmin from '../application/use_cases/user/CreateAdmin'
import FindUsers from '../application/use_cases/user/FindUsers'
import FindUserById from '../application/use_cases/user/FindUserById'
import UpdateUser from '../application/use_cases/user/UpdateUser'
import UpdateUserPassword from '../application/use_cases/user/UpdateUserPassword'
import DeleteUser from '../application/use_cases/user/DeleteUser'
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
import ValidateAuthorization from '../application/use_cases/auth/ValidateAuthorization'
import ValidateAuthorizationMiddleware from '../adapters/middlewares/auth/ValidateAuthorizationMiddleware'

const {
  app: {
    accessTokenSecret,
    tokenExpirationTime,
  }
} = config
// Drivers
const inMemoryDriver = new InMemoryDriver()
const cryptoDriver = new CryptoDriver()
const jwtDriver = new JwtDriver(accessTokenSecret, tokenExpirationTime)
// Repositories
const userRepository = new UserRepository(inMemoryDriver)
// Use Cases
const registerCustomerUseCase = new RegisterCustomer(userRepository, cryptoDriver)
const validateRegisterPayloadUseCase = new ValidateInput(RegisterCustomerSchema)
const authenticateUserUseCase = new AuthenticateUser(userRepository, jwtDriver)
const validateAuthenticateUserPayloadUseCase = new ValidateInput(AuthenticateUserSchema)
const validateAuthenticationUseCase = new ValidateAuthentication(jwtDriver)
const validateAuthorizationUseCase = new ValidateAuthorization()
const createAdminUseCase = new CreateAdmin(userRepository, cryptoDriver)
const validateCreateAdminPayloadUseCase = new ValidateInput(CreateAdminSchema)
const validateFindUsersPayloadUseCase = new ValidateInput(FindUsersSchema)
const validateFindUserByIdPayloadUseCase = new ValidateInput(FindUserByIdSchema)
const validateUpdateUserPayloadUseCase = new ValidateInput(UpdateUserSchema)
const validateUpdateUserPasswordPayloadUseCase = new ValidateInput(UpdateUserPasswordSchema)
const validateDeleteUserPayloadUseCase = new ValidateInput(DeleteUserSchema)
const findUsersUseCase = new FindUsers(userRepository)
const findUserByIdUseCase = new FindUserById(userRepository)
const updateUserUseCase = new UpdateUser(userRepository)
const updateUserPasswordUseCase = new UpdateUserPassword(userRepository)
const deleteUserUseCase = new DeleteUser(userRepository)
// Middlewares
const validateAuthenticationMiddleware = new ValidateAuthenticationMiddleware(validateAuthenticationUseCase)
const validateAuthorizationMiddleware = new ValidateAuthorizationMiddleware(validateAuthorizationUseCase)
const validateRegisterCustomerPayloadMiddleware = new ValidateInputMiddleware(validateRegisterPayloadUseCase)
const validateAuthenticateUserPayloadMiddleware = new ValidateInputMiddleware(validateAuthenticateUserPayloadUseCase)
const validateCreateAdminPayloadMiddleware = new ValidateInputMiddleware(validateCreateAdminPayloadUseCase)
const validateFindUsersPayloadMiddleware = new ValidateInputMiddleware(validateFindUsersPayloadUseCase)
const validateFindUserByIdPayloadMiddleware = new ValidateInputMiddleware(validateFindUserByIdPayloadUseCase)
const validateUpdateUserPayloadMiddleware = new ValidateInputMiddleware(validateUpdateUserPayloadUseCase)
const validateUpdateUserPasswordPayloadMiddleware = new ValidateInputMiddleware(validateUpdateUserPasswordPayloadUseCase)
const validateDeleteUserPayloadMiddleware = new ValidateInputMiddleware(validateDeleteUserPayloadUseCase)
// Controllers
const registerCustomerController = new RegisterCustomerController(registerCustomerUseCase)
const authenticateUserController = new AuthenticateUserController(authenticateUserUseCase)
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
