import jwt from 'jsonwebtoken'

export default class JwtDriver {
  constructor(private _accessTokenSecret: string, private _expirationTime: number) {}

  generate(data: string | object): string {
    return jwt.sign(data, this._accessTokenSecret, { expiresIn: this._expirationTime })
  }

  validate(token: string) {
    const result = <any>jwt.verify(token, this._accessTokenSecret)

    delete result.exp
    delete result.iat
  
    return result
  }
}
