export default {
  validate(payload: any): void | Error {
    const { email, password } = payload
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    if (!email)
      return Error('"email" is required')

    if (email && !emailRegex.test(email))
      return Error('Invalid "email" format')

    if (!password)
      return Error('"password" is required')

    const invalidParams = Object
      .keys(payload)
      .filter(key => !['email', 'password'].includes(key))
      .map(key => `"${ key }"`)
      .join(', ')
    
    if (invalidParams)
      return Error(`Invalid param(s): ${ invalidParams }`)
  }
}
