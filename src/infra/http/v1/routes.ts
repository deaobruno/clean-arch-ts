import authRoutes from './authRoutes'
import userRoutes from './userRoutes'

export default (dependencies: any) => {
  const prefix = '/api/v1'

  return [
    ...authRoutes(dependencies, prefix),
    ...userRoutes(dependencies, prefix)
  ]
}
