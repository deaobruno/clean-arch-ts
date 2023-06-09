import Server from '../../../Server'
import userRoutes from './user/userRoutes'

export default (server: Server) => {
  return [
    userRoutes(server)
  ]
}
