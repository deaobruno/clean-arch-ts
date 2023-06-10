export default {
  validate(payload: any) {
    Object.keys(payload).forEach(key => {
      switch (key) {
        case 'email':
          const { email } = payload
          const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

          if (!email) throw new Error('"email" is empty')
          if (typeof email !== 'string') throw new Error('"email" must be a string')
          if (!emailRegex.test(email)) throw new Error('Invalid "email" format')

          break
      
        default:
          throw new Error(`Invalid search param: ${key}`)
      }
    })
  }
}
