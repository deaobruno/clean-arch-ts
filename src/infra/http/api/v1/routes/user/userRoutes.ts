import CreateCustomerController from '../../../../../../adapters/controllers/user/CreateCustomerController'
import CreateAdminController from '../../../../../../adapters/controllers/user/CreateAdminController'
import FindUsersController from '../../../../../../adapters/controllers/user/FindUsersController'
import AdminPresenter from '../../../../../../adapters/presenters/user/AdminPresenter'
import CustomerPresenter from '../../../../../../adapters/presenters/user/CustomerPresenter'
import InMemoryUserRepository from '../../../../../../adapters/repositories/InMemoryUserRepository'
import CreateUserSchema from '../../../../../schemas/user/CreateUserSchema'
import FindUsersSchema from '../../../../../schemas/user/FindUsersSchema'
import FindUserByIdController from '../../../../../../adapters/controllers/user/FindUserByIdController'
import UpdateUserController from '../../../../../../adapters/controllers/user/UpdateUserController'
import UpdateUserSchema from '../../../../../schemas/user/UpdateUserSchema'
import UpdateUserPasswordController from '../../../../../../adapters/controllers/user/UpdateUserPasswordController'
import UpdateUserPasswordSchema from '../../../../../schemas/user/UpdateUserPasswordSchema'
import DeleteUserController from '../../../../../../adapters/controllers/user/DeleteUserController'
import CreateCustomerRoute from './CreateCustomerRoute'
import CreateAdminRoute from './CreateAdminRoute'
import Middleware from '../../../../../../adapters/middlewares/Middleware'
import CreateCustomer from '../../../../../../application/use_cases/user/CreateCustomer'
import CreateAdmin from '../../../../../../application/use_cases/user/CreateAdmin'
import FindUsers from '../../../../../../application/use_cases/user/FindUsers'
import FindUserById from '../../../../../../application/use_cases/user/FindUserById'
import UpdateUser from '../../../../../../application/use_cases/user/UpdateUser'
import UpdateUserPassword from '../../../../../../application/use_cases/user/UpdateUserPassword'
import DeleteUser from '../../../../../../application/use_cases/user/DeleteUser'
import FindUsersRoute from './FindUsersRoute'
import FindUserByIdRoute from './FindUserByIdRoute'
import UpdateUserRoute from './UpdateUserRoute'
import UpdateUserPasswordRoute from './UpdateUserPasswordRoute'
import DeleteUserRoute from './DeleteUserRoute'

const userRepository = new InMemoryUserRepository()

const createCustomerUseCase = new CreateCustomer(userRepository)
const createAdminUseCase = new CreateAdmin(userRepository)
const findUsersUseCase = new FindUsers(userRepository)
const findUserByIdUseCase = new FindUserById(userRepository)
const updateUserUseCase = new UpdateUser(userRepository)
const updateUserPasswordUseCase = new UpdateUserPassword(userRepository)
const deleteUserUseCase = new DeleteUser(userRepository)

const createCustomerController = new CreateCustomerController(createCustomerUseCase, CreateUserSchema)
const createAdminController = new CreateAdminController(createAdminUseCase, CreateUserSchema)
const findUsersController = new FindUsersController(findUsersUseCase, FindUsersSchema)
const findUserByIdController = new FindUserByIdController(findUserByIdUseCase)
const updateUserController = new UpdateUserController(updateUserUseCase, UpdateUserSchema)
const updateUserPasswordController = new UpdateUserPasswordController(updateUserPasswordUseCase, UpdateUserPasswordSchema)
const deleteUserController = new DeleteUserController(deleteUserUseCase)

const customerPresenter = new CustomerPresenter()
const adminPresenter = new AdminPresenter()

const basePath = '/users'

class TestMiddleware extends Middleware {}
const testMiddleware = new TestMiddleware({
  exec: async () => {
    console.log('test')
  }
})

const createCustomerRoute = new CreateCustomerRoute(basePath, createCustomerController, customerPresenter)
const createAdminRoute = new CreateAdminRoute(`${basePath}/admin`, createAdminController, adminPresenter, [testMiddleware])
const findUsersRoute = new FindUsersRoute(basePath, findUsersController, customerPresenter)
const findUserByIdRoute = new FindUserByIdRoute(`${basePath}/:userId`, findUserByIdController, customerPresenter)
const updateUserRoute = new UpdateUserRoute(`${basePath}/:userId`, updateUserController, customerPresenter)
const updateUserPasswordRoute = new UpdateUserPasswordRoute(`${basePath}/:userId/update-password`, updateUserPasswordController, customerPresenter)
const deleteUser = new DeleteUserRoute(`${basePath}/:userId`, deleteUserController)

export default [
  createCustomerRoute,
  createAdminRoute,
  findUsersRoute,
  findUserByIdRoute,
  updateUserRoute,
  updateUserPasswordRoute,
  deleteUser,
]
