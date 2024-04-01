import joi from 'joi'

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i

export default {
  validate: (payload: any): void | Error => {
    const { error } = joi.object({
      email: joi.string().email().max(100).required(),
      password: joi.string().min(8).max(16).required(),
    }).validate(payload)

    if (error)
      return error
  }
}
