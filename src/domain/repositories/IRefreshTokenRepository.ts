import RefreshToken from '../RefreshToken'
import IRepository from '../../infra/drivers/db/IDbDriver'

export default interface IRefreshTokenRepository extends IRepository<RefreshToken> {}
