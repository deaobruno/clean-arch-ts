import IMapper from "../IMapper";
import IDbRefreshToken from "./IDbRefreshToken";
import RefreshToken from "./RefreshToken";

export default class RefreshTokenMapper
  implements IMapper<RefreshToken, IDbRefreshToken>
{
  entityToDb(refreshToken: RefreshToken): IDbRefreshToken {
    const { userId, token } = refreshToken;

    return {
      user_id: userId,
      token,
    };
  }

  dbToEntity(data: IDbRefreshToken): RefreshToken {
    const { user_id, token } = data;

    return RefreshToken.create({
      userId: user_id,
      token,
    });
  }
}
