import InMemoryDriver from "./drivers/InMemoryDriver"
import UserRepository from "../adapters/repositories/UserRepository"
import { CreateAdmin } from "../application/use_cases/user/CreateAdmin"
import { Register } from "../application/use_cases/auth/Register"
import { FindUsers } from "../application/use_cases/user/FindUsers"
import FindUserById from "../application/use_cases/user/FindUserById"
import { UpdateUser } from "../application/use_cases/user/UpdateUser"
import { UpdateUserPassword } from "../application/use_cases/user/UpdateUserPassword"
import DeleteUser from "../application/use_cases/user/DeleteUser"
import CreateAdminSchema from "./schemas/user/CreateAdminSchema"
import FindUsersSchema from "./schemas/user/FindUsersSchema"
import UpdateUserSchema from "./schemas/user/UpdateUserSchema"
import UpdateUserPasswordSchema from "./schemas/user/UpdateUserPasswordSchema"
import CreateAdminController from "../adapters/controllers/user/CreateAdminController"
import RegisterController from "../adapters/controllers/auth/RegisterController"
import FindUsersController from "../adapters/controllers/user/FindUsersController"
import FindUserByIdController from "../adapters/controllers/user/FindUserByIdController"
import UpdateUserController from "../adapters/controllers/user/UpdateUserController"
import UpdateUserPasswordController from "../adapters/controllers/user/UpdateUserPasswordController"
import DeleteUserController from "../adapters/controllers/user/DeleteUserController"
import CustomerPresenter from "../adapters/presenters/user/CustomerPresenter"
import AdminPresenter from "../adapters/presenters/user/AdminPresenter"
import CryptoDriver from "./drivers/CryptoDriver"
import FindUserByIdSchema from "./schemas/user/FindUserByIdSchema"
import DeleteUserSchema from "./schemas/user/DeleteUserSchema"

const inMemoryDriver = new InMemoryDriver()
const cryptoDriver = new CryptoDriver()

const userRepository = new UserRepository(inMemoryDriver)

const registerUseCase = new Register(userRepository, cryptoDriver)
const createAdminUseCase = new CreateAdmin(userRepository, cryptoDriver)
const findUsersUseCase = new FindUsers(userRepository)
const findUserByIdUseCase = new FindUserById(userRepository)
const updateUserUseCase = new UpdateUser(userRepository)
const updateUserPasswordUseCase = new UpdateUserPassword(userRepository)
const deleteUserUseCase = new DeleteUser(userRepository)

const registerController = new RegisterController(registerUseCase, CreateAdminSchema)
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

  },
  controllers: {
    registerController,
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
