import IRepository from '../../infra/drivers/db/IDbDriver'
import IRefreshTokenRepository from '../../domain/repositories/IRefreshTokenRepository'
import RefreshToken from '../../domain/RefreshToken'

export default class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private _dbDriver: IRepository<RefreshToken>) {}

  find = (filters?: object) => (this._dbDriver.find)(filters)
  findOne = (filters: object) => (this._dbDriver.findOne)(filters)
  delete = (filters: object) => (this._dbDriver.delete)(filters)

  async save(entity: RefreshToken) {
    return this._dbDriver.save(entity, { token: entity.token })
  }
}
