import joi from 'joi';

export default {
  validate: (payload: unknown): void | Error => {
    const { error } = joi
      .object({
        memo_id: joi.string().uuid().required(),
      })
      .validate(payload);

    if (error) return error;
  },
};
