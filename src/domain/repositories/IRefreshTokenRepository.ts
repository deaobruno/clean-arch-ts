import { RefreshToken } from '../RefreshToken'
import IRepository from '../../infra/drivers/db/IDbDriver'

export default interface IRefreshTokenRepository extends IRepository {
  findOneByUserId(userId: string): Promise<RefreshToken | undefined>
  findOneByToken(token: string): Promise<RefreshToken | undefined>
}
