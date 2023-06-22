export default {
  validate(payload: any): void | Error {
    const { userId, password, confirm_password } = payload
    let error

    Object.keys(payload).forEach(key => {
      switch (key) {
        case 'userId':
          const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi

          if (!userId)
            error = new Error('User ID is required')

          if (userId && !uuidRegex.test(userId))
            error = new Error('User ID must be an UUID')

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
