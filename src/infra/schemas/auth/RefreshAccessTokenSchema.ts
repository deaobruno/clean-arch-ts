import joi from 'joi';

export default {
  validate: (payload: unknown): void | Error => {
    const { error } = joi
      .object({
        refresh_token: joi.string().required(),
      })
      .validate(payload);

    if (error) return error;
  },
};
