export type RefreshTokenParams = {
  userId: string
  token: string
}

export class RefreshToken {
  readonly userId: string
  readonly token: string

  private constructor(params: RefreshTokenParams) {
    const { userId, token } = params

    this.userId = userId
    this.token = token
  }

  static create(params: RefreshTokenParams) {
    const { userId, token } = params
    const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi

    if (!userId)
      throw new Error('RefreshToken: "userId" required')

    if (!userId || (userId && !uuidRegex.test(userId)))
      throw new Error('RefreshToken: Invalid "userId"')

    if (!token)
      throw new Error('RefreshToken: "token" required')

    return new RefreshToken(params)
  }
}
