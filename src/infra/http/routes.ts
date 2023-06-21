import dependencies from '../dependencies'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'

export default [
  ...authRoutes(dependencies),
  ...userRoutes(dependencies),
]
