type RefreshTokenParams = {
  token: string
}

export default class RefreshToken {
  readonly token: string

  private constructor(params: RefreshTokenParams) {
    const { token } = params

    this.token = token
  }

  static create(params: RefreshTokenParams) {
    const { token } = params

    if (!token)
      throw new Error('RefreshToken: "token" required')

    return new RefreshToken(params)
  }
}
