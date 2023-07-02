import config from './config'
import InMemoryDriver from './drivers/InMemoryDriver'
import UserRepository from '../adapters/repositories/UserRepository'
import { CreateAdmin } from '../application/use_cases/user/CreateAdmin'
import RegisterUser from '../application/use_cases/auth/RegisterUser'
import { FindUsers } from '../application/use_cases/user/FindUsers'
import FindUserById from '../application/use_cases/user/FindUserById'
import { UpdateUser } from '../application/use_cases/user/UpdateUser'
import { UpdateUserPassword } from '../application/use_cases/user/UpdateUserPassword'
import DeleteUser from '../application/use_cases/user/DeleteUser'
import CreateAdminSchema from './schemas/user/CreateAdminSchema'
import FindUsersSchema from './schemas/user/FindUsersSchema'
import UpdateUserSchema from './schemas/user/UpdateUserSchema'
import UpdateUserPasswordSchema from './schemas/user/UpdateUserPasswordSchema'
import CreateAdminController from '../adapters/controllers/user/CreateAdminController'
import RegisterUserController from '../adapters/controllers/auth/RegisterUserController'
import FindUsersController from '../adapters/controllers/user/FindUsersController'
import FindUserByIdController from '../adapters/controllers/user/FindUserByIdController'
import UpdateUserController from '../adapters/controllers/user/UpdateUserController'
import UpdateUserPasswordController from '../adapters/controllers/user/UpdateUserPasswordController'
import DeleteUserController from '../adapters/controllers/user/DeleteUserController'
import CustomerPresenter from '../adapters/presenters/user/CustomerPresenter'
import AdminPresenter from '../adapters/presenters/user/AdminPresenter'
import CryptoDriver from './drivers/CryptoDriver'
import FindUserByIdSchema from './schemas/user/FindUserByIdSchema'
import DeleteUserSchema from './schemas/user/DeleteUserSchema'
import AuthenticateUserController from '../adapters/controllers/auth/AuthenticateUserController'
import AuthenticateUser from '../application/use_cases/auth/AuthenticateUser'
import JwtDriver from './drivers/JwtDriver'
import AuthenticateUserSchema from './schemas/auth/AuthenticateUserSchema'
import ValidateAuthenticationMiddleware from '../adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import ValidateAuthentication from '../application/use_cases/auth/ValidateAuthentication'
import RegisterUserSchema from './schemas/auth/RegisterUserSchema'

const {
  app: {
    accessTokenSecret,
  }
} = config

const inMemoryDriver = new InMemoryDriver()
const cryptoDriver = new CryptoDriver()
const jwtDriver = new JwtDriver(accessTokenSecret)

const userRepository = new UserRepository(inMemoryDriver)

const registerUserUseCase = new RegisterUser(userRepository, cryptoDriver)
const authenticateUserUseCase = new AuthenticateUser(userRepository, jwtDriver)
const validateAuthenticationUseCase = new ValidateAuthentication(jwtDriver)
const createAdminUseCase = new CreateAdmin(userRepository, cryptoDriver)
const findUsersUseCase = new FindUsers(userRepository)
const findUserByIdUseCase = new FindUserById(userRepository)
const updateUserUseCase = new UpdateUser(userRepository)
const updateUserPasswordUseCase = new UpdateUserPassword(userRepository)
const deleteUserUseCase = new DeleteUser(userRepository)

const validateAuthenticationMiddleware = new ValidateAuthenticationMiddleware(validateAuthenticationUseCase)

const registerUserController = new RegisterUserController(registerUserUseCase, RegisterUserSchema)
const authenticateUserController = new AuthenticateUserController(authenticateUserUseCase, AuthenticateUserSchema)
const createAdminController = new CreateAdminController(createAdminUseCase, CreateAdminSchema)
const findUsersController = new FindUsersController(findUsersUseCase, FindUsersSchema)
const findUserByIdController = new FindUserByIdController(findUserByIdUseCase, FindUserByIdSchema)
const updateUserController = new UpdateUserController(updateUserUseCase, UpdateUserSchema)
const updateUserPasswordController = new UpdateUserPasswordController(updateUserPasswordUseCase, UpdateUserPasswordSchema)
const deleteUserController = new DeleteUserController(deleteUserUseCase, DeleteUserSchema)

const customerPresenter = new CustomerPresenter()
const adminPresenter = new AdminPresenter()

export default {
  middlewares: {
    validateAuthenticationMiddleware,
  },
  controllers: {
    registerUserController,
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
