export default {
  validate(payload: any): void | Error {
    let error

    Object.keys(payload).forEach(key => {
      switch (key) {
        case 'email':
          const { email } = payload
          const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

          if (!email)
            error = new Error('"email" is required')

          if (email && !emailRegex.test(email))
            error = new Error('Invalid "email" format')

          break

        default:
          error = new Error(`Invalid param: "${key}"`)
      }
    })

    return error
  }
}
