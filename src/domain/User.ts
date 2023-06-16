import CryptoDriver from '../infra/drivers/CryptoDriver'

export enum LevelEnum {
  ROOT,
  ADMIN,
  CUSTOMER,
}

type UserParams = {
  email: string
  password: string
  level: LevelEnum
}

export class User {
  readonly user_id: string
  public email: string
  public password: string
  readonly level: number

  private constructor(params: UserParams, id?: string) {
    const { email, password, level } = params

    this.user_id = id ?? CryptoDriver.generateID()
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

  static create(params: UserParams, id?: string) {
    const { email, password, level } = params
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    if (!emailRegex.test(email))
      throw new Error('User: Invalid email')

    if (!password)
      throw new Error('User: Password required')

    if (!Object.values(LevelEnum).includes(level))
      throw new Error('User: Invalid level')

    return new User(params, id)
  }
}
