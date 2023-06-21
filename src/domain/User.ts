export enum LevelEnum {
  ROOT,
  ADMIN,
  CUSTOMER,
}

type UserParams = {
  user_id: string
  email: string
  password: string
  level: LevelEnum
}

export class User {
  readonly user_id: string
  public email: string
  public password: string
  readonly level: number

  private constructor(params: UserParams) {
    const { user_id, email, password, level } = params

    this.user_id = user_id
    this.email = email
    this.password = password
    this.level = level
  }

  get isRoot(): boolean {
    return this.level === LevelEnum.ROOT
  }

  get isAdmin(): boolean {
    return this.level === LevelEnum.ADMIN
  }

  get isCustomer(): boolean {
    return this.level === LevelEnum.CUSTOMER
  }

  static create(params: UserParams) {
    const { user_id, email, password, level } = params
    const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    if (!user_id)
      throw new Error('User: "user_id" required')

    if (!user_id || (user_id && !uuidRegex.test(user_id)))
      throw new Error('User: Invalid "user_id"')

    if (!email)
      throw new Error('User: "email" required')

    if (!emailRegex.test(email))
      throw new Error('User: Invalid "email"')

    if (!password)
      throw new Error('User: "password" required')

    if (!Object.values(LevelEnum).includes(level))
      throw new Error('User: Invalid "level"')

    return new User(params)
  }
}
