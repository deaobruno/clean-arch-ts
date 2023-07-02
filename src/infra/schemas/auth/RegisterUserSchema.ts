export default {
  validate(payload: any): void | Error {
    const { email, password, confirm_password } = payload
    let error

    Object.keys(payload).forEach(key => {
      switch (key) {
        case 'email':
          const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

          if (!email)
            error = new Error('"email" is required')

          if (email && !emailRegex.test(email))
            error = new Error('Invalid "email" format')

          break
      
        case 'password':
          if (!password)
            error = new Error('"password" is required')

          break

        case 'confirm_password':
          if (!confirm_password)
            error = new Error('"confirm_password" is required')

          break
      
        default:
          error = new Error(`Invalid param: "${key}"`)
      }
    })

    if (password && confirm_password && (password !== confirm_password))
      error = new Error('Passwords mismatch')

    return error
  }
}
