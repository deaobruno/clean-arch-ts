export default {
  validate(payload: any): void | Error {
    let error

    Object.keys(payload).forEach(key => {
      switch (key) {
        case 'userId':
          break

        case 'email':
          const { email } = payload
          const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

          if (!email)
            error = new Error('"email" is empty')

          if (typeof email !== 'string')
            error = new Error('"email" must be a string')

          if (!emailRegex.test(email))
            error = new Error('Invalid "email" format')

          break
      
        default:
          error = new Error(`Invalid search param: ${key}`)
      }
    })

    return error
  }
}
