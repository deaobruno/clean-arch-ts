import joi from 'joi'

export default {
  validate: (payload: any): void | Error => {
    const { error } = joi.object({
      user_id: joi.string().uuid().required(),
    }).validate(payload)

    if (error)
      return error
  }
}
