export default {
  validate(payload: any): void | Error {
    const { email } = payload
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    if (!email)
      return new Error('"email" is required')

    if (!emailRegex.test(email))
      return new Error('Invalid "email" format')

    if (!payload.password)
      return new Error('"password" is required')

    if (!payload.confirm_password)
      return new Error('"confirm_password" is required')
  }
}
