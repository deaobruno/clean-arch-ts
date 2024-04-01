import joi from 'joi'

export default {
  validate: (payload: any): void | Error => {
    const { error } = joi.object({
      memo_id: joi.string().uuid().required(),
      title: joi.string().min(5).max(100),
      text: joi.string().min(8).max(64),
      start: joi.date().iso(),
      end: joi.date().iso().min(joi.ref('start')),
    }).validate(payload)

    if (error)
      return error
  }
}
