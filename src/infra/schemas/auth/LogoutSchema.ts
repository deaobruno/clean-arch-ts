import joi from 'joi'

export default {
  validate: (payload: any): void | Error => {
    const { error } = joi.object({
      refresh_token: joi.string().required(),
    }).validate(payload)

    if (error)
      return error
  }
}
