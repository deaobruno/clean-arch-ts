export default {
  validate(payload: any): void | Error {
    const { email } = payload
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    if (email === '')
      return Error('"email" is required')

    if (email && !emailRegex.test(email))
      return Error('Invalid "email" format')

    const invalidParams = Object
      .keys(payload)
      .filter(key => !['userId', 'email', 'limit', 'page'].includes(key))
      .map(key => `"${ key }"`)
      .join(', ')
    
    if (invalidParams)
      return Error(`Invalid param(s): ${ invalidParams }`)
  }
}
