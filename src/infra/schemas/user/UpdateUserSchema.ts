import joi from 'joi';

export default {
  validate: (payload: unknown): void | Error => {
    const { error } = joi
      .object({
        user_id: joi.string().uuid().required(),
        email: joi.string().email().max(100),
      })
      .validate(payload);

    if (error) return error;
  },
};
