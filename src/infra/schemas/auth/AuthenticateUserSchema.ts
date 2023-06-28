export default {
  validate(payload: any): void | Error {
    const { email, password } = payload
    let error
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    if (!email)
      error = new Error('"email" is required')

    if (email && !emailRegex.test(email))
      error = new Error('Invalid "email" format')

    if (!password)
      error = new Error('"password" is required')

    Object.keys(payload).forEach(key => {
      if (!['email', 'password'].includes(key))
        error = new Error(`Invalid param: "${key}"`)
    })

    return error
  }
}
