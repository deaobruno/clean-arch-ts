import joi from 'joi';

export default {
  validate: (payload: unknown): void | Error => {
    const { error } = joi
      .object({
        user_id: joi.string().uuid().required(),
        limit: joi.string(),
        page: joi.string(),
      })
      .validate(payload);

    if (error) return error;
  },
};
