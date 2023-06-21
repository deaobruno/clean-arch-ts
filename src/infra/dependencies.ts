import InMemoryDriver from "./drivers/InMemoryDriver"
import UserRepository from "../adapters/repositories/UserRepository"
import CreateAdmin from "../application/use_cases/user/CreateAdmin"
import CreateCustomer from "../application/use_cases/user/CreateCustomer"
import { FindUsers } from "../application/use_cases/user/FindUsers"
import FindUserById from "../application/use_cases/user/FindUserById"
import UpdateUser from "../application/use_cases/user/UpdateUser"
import UpdateUserPassword from "../application/use_cases/user/UpdateUserPassword"
import DeleteUser from "../application/use_cases/user/DeleteUser"
import CreateUserSchema from "./schemas/user/CreateUserSchema"
import FindUsersSchema from "./schemas/user/FindUsersSchema"
import UpdateUserSchema from "./schemas/user/UpdateUserSchema"
import UpdateUserPasswordSchema from "./schemas/user/UpdateUserPasswordSchema"
import TestMiddleware from "../adapters/middlewares/test_mid/TestMiddleware"
import CreateAdminController from "../adapters/controllers/user/CreateAdminController"
import CreateCustomerController from "../adapters/controllers/user/CreateCustomerController"
import FindUsersController from "../adapters/controllers/user/FindUsersController"
import FindUserByIdController from "../adapters/controllers/user/FindUserByIdController"
import UpdateUserController from "../adapters/controllers/user/UpdateUserController"
import UpdateUserPasswordController from "../adapters/controllers/user/UpdateUserPasswordController"
import DeleteUserController from "../adapters/controllers/user/DeleteUserController"
import CustomerPresenter from "../adapters/presenters/user/CustomerPresenter"
import AdminPresenter from "../adapters/presenters/user/AdminPresenter"
import CryptoDriver from "./drivers/CryptoDriver"

const inMemoryDriver = new InMemoryDriver()
const cryptoDriver = new CryptoDriver()

const userRepository = new UserRepository(inMemoryDriver)

const createAdminUseCase = new CreateAdmin(userRepository, cryptoDriver)
const createCustomerUseCase = new CreateCustomer(userRepository, cryptoDriver)
const findUsersUseCase = new FindUsers(userRepository)
const findUserByIdUseCase = new FindUserById(userRepository)
const updateUserUseCase = new UpdateUser(userRepository)
const updateUserPasswordUseCase = new UpdateUserPassword(userRepository)
const deleteUserUseCase = new DeleteUser(userRepository)

const testMiddleware = new TestMiddleware()

const createAdminController = new CreateAdminController(createAdminUseCase, CreateUserSchema)
const createCustomerController = new CreateCustomerController(createCustomerUseCase, CreateUserSchema)
const findUsersController = new FindUsersController(findUsersUseCase, FindUsersSchema)
const findUserByIdController = new FindUserByIdController(findUserByIdUseCase)
const updateUserController = new UpdateUserController(updateUserUseCase, UpdateUserSchema)
const updateUserPasswordController = new UpdateUserPasswordController(updateUserPasswordUseCase, UpdateUserPasswordSchema)
const deleteUserController = new DeleteUserController(deleteUserUseCase)

const customerPresenter = new CustomerPresenter()
const adminPresenter = new AdminPresenter()

export default {
  middlewares: {
    testMiddleware,
  },
  controllers: {
    createAdminController,
    createCustomerController,
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
