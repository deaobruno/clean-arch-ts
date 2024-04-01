import joi from 'joi'

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
