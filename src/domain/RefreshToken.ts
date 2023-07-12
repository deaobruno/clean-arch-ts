type RefreshTokenParams = {
  user_id: string
  token: string
}

export default class RefreshToken {
  readonly user_id: string
  readonly token: string

  private constructor(params: RefreshTokenParams) {
    const { user_id, token } = params

    this.user_id = user_id
    this.token = token
  }

  static create(params: RefreshTokenParams) {
    const { user_id, token } = params
    const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi

    if (!user_id)
      throw new Error('User: "user_id" required')

    if (!user_id || (user_id && !uuidRegex.test(user_id)))
      throw new Error('User: Invalid "user_id"')

    if (!token)
      throw new Error('RefreshToken: "token" required')

    return new RefreshToken(params)
  }
}
