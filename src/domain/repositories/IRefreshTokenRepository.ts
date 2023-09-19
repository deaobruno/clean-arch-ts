import { RefreshToken } from '../RefreshToken'

export default interface IRefreshTokenRepository {
  save(data: any, filters?: object): Promise<RefreshToken>
  find(filters?: object): Promise<RefreshToken[]>
  findOne(filters: object): Promise<RefreshToken | undefined>
  delete(filters: object): Promise<void>
  findOneByUserId(userId: string): Promise<RefreshToken | undefined>
  findOneByToken(token: string): Promise<RefreshToken | undefined>
}
