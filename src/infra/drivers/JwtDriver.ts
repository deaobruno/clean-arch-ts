import jwt from 'jsonwebtoken'

export default class JwtDriver {
  private _expirationTime = 3600 // seconds

  constructor(private _accessTokenSecret: string) {}

  generate(data: string | object): string {
    return jwt.sign(data, this._accessTokenSecret, { expiresIn: this._expirationTime })
  }

  validate(token: string) {
    return jwt.verify(token, this._accessTokenSecret)
  }
}
