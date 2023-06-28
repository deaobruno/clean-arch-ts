import dependencies from '../../dependencies'
import BaseRoute from '../BaseRoute'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'

const prefix = '/api/v1'
const routes: BaseRoute[] = []

authRoutes(dependencies).forEach(route => routes.push(route));
userRoutes(dependencies).forEach(route => routes.push(route));

export default {
  prefix,
  routes,
}
