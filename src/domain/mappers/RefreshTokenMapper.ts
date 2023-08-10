import { RefreshToken } from '../RefreshToken'
import IMapper from './IMapper'

export type DbRefreshToken = {
  user_id: string
  token: string
}

export class RefreshTokenMapper implements IMapper<RefreshToken, DbRefreshToken> {
  entityToDb(refreshToken: RefreshToken): DbRefreshToken {
    const {
      userId,
      token,
    } = refreshToken

    return {
      user_id: userId,
      token,
    }
  }

  dbToEntity(data: DbRefreshToken): RefreshToken {
    const {
      user_id,
      token,
    } = data

    return RefreshToken.create({
      userId: user_id,
      token,
    })
  }
}
