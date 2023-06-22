export default {
  validate(payload: any): void | Error {
    let error

    Object.keys(payload).forEach(key => {
      switch (key) {
        case 'userId':
          const { userId } = payload
          const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi

          if (!userId)
            error = new Error('User ID is required')

          if (userId && !uuidRegex.test(userId))
            error = new Error('User ID must be an UUID')

          break

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
