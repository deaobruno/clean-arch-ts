import dependencies from '../dependencies'
import userRoutes from './userRoutes'

export default [
  ...userRoutes(dependencies),
]
