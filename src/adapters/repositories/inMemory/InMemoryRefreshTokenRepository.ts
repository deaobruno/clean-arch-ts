import IRepository from '../../../infra/drivers/db/IDbDriver'
import IRefreshTokenRepository from '../../../domain/repositories/IRefreshTokenRepository'
import { RefreshToken, RefreshTokenParams } from '../../../domain/RefreshToken'
import { RefreshTokenMapper } from '../../../domain/mappers/RefreshTokenMapper'

export default class InMemoryRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    private _dbDriver: IRepository,
    private _mapper: RefreshTokenMapper,
  ) {}

  async save(params: RefreshTokenParams): Promise<RefreshToken> {
    const refreshToken = RefreshToken.create(params)
    const dbRefreshToken = this._mapper.entityToDb(refreshToken)

    await this._dbDriver.save(dbRefreshToken, { user_id: refreshToken.userId })

    return refreshToken
  }

  async find(filters?: object): Promise<RefreshToken[]> {
    const refreshTokens = await this._dbDriver.find(filters)

    return refreshTokens.map(this._mapper.dbToEntity)
  }

  async findOne(filters: object): Promise<RefreshToken | undefined> {
    const refreshToken = await this._dbDriver.findOne(filters)

    if (refreshToken)
      return this._mapper.dbToEntity(refreshToken)
  }

  async findOneByUserId(userId: string): Promise<RefreshToken | undefined> {
    const refreshToken = await this._dbDriver.findOne({ user_id: userId })

    if (refreshToken)
      return this._mapper.dbToEntity(refreshToken)
  }

  async findOneByToken(token: string): Promise<RefreshToken | undefined> {
    const refreshToken = await this._dbDriver.findOne({ token })

    if (refreshToken)
      return this._mapper.dbToEntity(refreshToken)
  }

  async delete(filters: object): Promise<void> {
    await this._dbDriver.delete(filters)
  }
}
