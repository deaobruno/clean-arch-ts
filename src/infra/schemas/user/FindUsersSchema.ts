import joi from 'joi';

export default {
  validate: (payload: unknown): void | Error => {
    const { error } = joi
      .object({
        email: joi.string().email().max(100),
        limit: joi.string(),
        page: joi.string(),
      })
      .validate(payload);

    if (error) return error;
  },
};
