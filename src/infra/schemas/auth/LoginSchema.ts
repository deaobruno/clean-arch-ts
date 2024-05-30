import joi from 'joi';

export default {
  validate: (payload: unknown): void | Error => {
    const { error } = joi
      .object({
        email: joi.string().email().required(),
        password: joi.string().min(8).max(16).required(),
        device_id: joi.string().uuid(),
        device: joi.object({
          title: joi.string().min(1).max(50).required(),
          ip: joi.string().ip().required(),
          latitude: joi.string(),
          longitude: joi.string(),
          platform: joi.string().min(1).max(10).required(),
          model: joi.string().min(1).max(25).required(),
        }),
      })
      .or('device_id', 'device')
      .validate(payload);

    if (error) return error;
  },
};
