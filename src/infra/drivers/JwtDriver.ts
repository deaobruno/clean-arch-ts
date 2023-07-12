import jwt from 'jsonwebtoken'

export default class JwtDriver {
  constructor(
    private _accessTokenSecret: string,
    private _accessTokenExpirationTime: number,
    private _refreshTokenSecret: string,
    private _refreshTokenExpirationTime: number,
  ) {}

  private _generateToken = (data: string | object, secret: string, expiresIn: number): string => jwt.sign(data, secret, { expiresIn })

  private _validateToken = (token: string, secret: string) => {
    const result = <any>jwt.verify(token, secret)

    delete result.exp
    delete result.iat

    return result
  }

  generateAccessToken(data: string | object): string {
    return this._generateToken(data, this._accessTokenSecret, this._accessTokenExpirationTime)
  }

  generateRefreshToken(data: string | object): string {
    return this._generateToken(data, this._refreshTokenSecret, this._refreshTokenExpirationTime)
  }

  validateAccessToken(token: string) {
    return this._validateToken(token, this._accessTokenSecret)
  }

  validateRefreshToken(token: string) {
    return this._validateToken(token, this._refreshTokenSecret)
  }
}
