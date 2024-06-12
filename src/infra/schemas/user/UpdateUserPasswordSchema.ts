import joi from 'joi';

const lowerCaseRegex = /.*[a-z]/;
const upperCaseRegex = /.*[A-Z]/;
const numberRegex = /.*[0-9]/;
const specialCharacterRegex = /.*[!@#$&*]/;

export default {
  validate: (payload: unknown): void | Error => {
    const userIdValidation = joi.object({
      user_id: joi.string().uuid(),
    });

    const lengthValidation = joi.object({
      password: joi.string().min(8).max(64),
    });

    const lowerCaseValidation = joi.object({
      password: joi.string().regex(lowerCaseRegex),
    });

    const upperCaseValidation = joi.object({
      password: joi.string().regex(upperCaseRegex),
    });

    const numberValidation = joi.object({
      password: joi.string().regex(numberRegex),
    });

    const specialCharacterValidation = joi.object({
      password: joi.string().regex(specialCharacterRegex),
    });

    const passwordValidation = lengthValidation
      .concat(lowerCaseValidation)
      .concat(upperCaseValidation)
      .concat(numberValidation)
      .concat(specialCharacterValidation);

    const confirmPasswordValidation = joi.object({
      confirm_password: joi.ref('password'),
    });

    const { error } = userIdValidation
      .concat(passwordValidation)
      .concat(confirmPasswordValidation)
      .validate(payload);

    if (error) return error;
  },
};
