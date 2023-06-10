export default {
  validate(payload: any) {
    const { email } = payload
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    if (!email) throw new Error('"email" is required')
    if (!emailRegex.test(email)) throw new Error('Invalid "email" format')
    if (!payload.password) throw new Error('"password" is required')
    if (!payload.confirm_password) throw new Error('"confirm_password" is required')
  }
}
