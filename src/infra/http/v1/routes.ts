import BaseRoute from './routes/BaseRoute'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'

const routes: BaseRoute[] = []

export default (dependencies: any) => {
  authRoutes(dependencies).forEach(route => routes.push(route));
  userRoutes(dependencies).forEach(route => routes.push(route));

  return routes
}
