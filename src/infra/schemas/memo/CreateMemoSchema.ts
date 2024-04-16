import joi from 'joi';

export default {
  validate: (payload: unknown): void | Error => {
    const { error } = joi
      .object({
        title: joi.string().min(5).max(100).required(),
        text: joi.string().min(8).max(64).required(),
        start: joi.date().iso().required(),
        end: joi.date().iso().min(joi.ref('start')).required(),
      })
      .validate(payload);

    if (error) return error;
  },
};
