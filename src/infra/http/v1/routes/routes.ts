import IServer from '../../../drivers/server/IServerDriver'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'

export default (dependencies: any, server: IServer) => {
  const prefix = '/api/v1'

  authRoutes(dependencies, server, prefix),
  userRoutes(dependencies, server, prefix)
}
