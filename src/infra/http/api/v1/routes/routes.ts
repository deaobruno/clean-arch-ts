import dependencies from '../../../../dependencies'
import userRoutes from './user/userRoutes'

export default [
  ...userRoutes(dependencies),
]
