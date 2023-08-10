import { RefreshToken } from '../../../src/domain/RefreshToken'

export default {
  save(token: RefreshToken): Promise<RefreshToken> {
    return Promise.resolve(token)
  },
  find(filters: any): Promise<RefreshToken[]> {
    return Promise.resolve([])
  },
  findOne(filters: any): Promise<RefreshToken | undefined> {
    return Promise.resolve(undefined)
  },
  findOneByUserId(filters: any): Promise<RefreshToken | undefined> {
    return Promise.resolve(undefined)
  },
  findOneByToken(): Promise<RefreshToken | undefined> {
    return Promise.resolve(undefined)
  },
  delete(): Promise<void> {
    return Promise.resolve(undefined)
  },
}
