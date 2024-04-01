import joi from 'joi'

export default {
  validate: (payload: any): void | Error => {
    const { error } = joi.object({
      user_id: joi.string().uuid().required(),
      email: joi.string().email().max(100).required(),
    }).validate(payload)

    if (error)
      return error
  }
}
