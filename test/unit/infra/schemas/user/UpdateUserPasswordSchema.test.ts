import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UpdateUserPasswordSchema from '../../../../../src/infra/schemas/user/UpdateUserPasswordSchema';

const { validate } = UpdateUserPasswordSchema;
const user_id = faker.string.uuid();
const password = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;

describe('/infra/schemas/user/UpdateUserPasswordSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      user_id,
      password,
      confirm_password: password,
    });

    expect(validation).equal(undefined);
  });

  it('should fail when user ID is empty', () => {
    const validation = <Error>validate({
      user_id: '',
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"user_id" is not allowed to be empty');
  });

  it('should fail when passing a number as user ID', () => {
    const validation = <Error>validate({
      user_id: 123,
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"user_id" must be a string');
  });

  it('should fail when passing a boolean as user ID', () => {
    const validation = <Error>validate({
      user_id: true,
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"user_id" must be a string');
  });

  it('should fail when passing an object as user ID', () => {
    const validation = <Error>validate({
      user_id: { test: 'test' },
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"user_id" must be a string');
  });

  it('should fail when passing a Bigint as user ID', () => {
    const validation = <Error>validate({
      user_id: BigInt(9007199254740991n),
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"user_id" must be a string');
  });

  it('should fail when passing invalid user ID', () => {
    const validation = <Error>validate({
      user_id: 'test',
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"user_id" must be a valid GUID');
  });

  it('should fail when password is empty', () => {
    const validation = <Error>validate({
      user_id,
      password: '',
      confirm_password: password,
    });

    expect(validation.message).equal('"password" is not allowed to be empty');
  });

  it('should fail when password length is lower than 8', () => {
    const validation = <Error>validate({
      user_id,
      password: `${faker.string.alpha(7)}`,
      confirm_password: password,
    });

    expect(validation.message).equal(
      '"password" length must be at least 8 characters long',
    );
  });

  it('should fail when password length is greater than 64', () => {
    const validation = <Error>validate({
      user_id,
      password: `${faker.string.alpha(65)}`,
      confirm_password: password,
    });

    expect(validation.message).equal(
      '"password" length must be less than or equal to 64 characters long',
    );
  });

  it('should fail when password does not have a lower case character', () => {
    const wrongPassword = `${faker.string.alpha({ length: 4, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const validation = <Error>validate({
      user_id,
      password: wrongPassword,
      confirm_password: password,
    });

    expect(validation.message).equal(
      `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[a-z]/`,
    );
  });

  it('should fail when password does not have an upper case character', () => {
    const wrongPassword = `${faker.string.alpha({ length: 4, casing: 'lower' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;
    const validation = <Error>validate({
      user_id,
      password: wrongPassword,
      confirm_password: password,
    });

    expect(validation.message).equal(
      `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[A-Z]/`,
    );
  });

  it('should fail when password does not have a number character', () => {
    const wrongPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.fromCharacters('!@#$&*', 4)}`;
    const validation = <Error>validate({
      user_id,
      password: wrongPassword,
      confirm_password: password,
    });

    expect(validation.message).equal(
      `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[0-9]/`,
    );
  });

  it('should fail when password does not have a special character', () => {
    const wrongPassword = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 4 })}`;
    const validation = <Error>validate({
      user_id,
      password: wrongPassword,
      confirm_password: password,
    });

    expect(validation.message).equal(
      `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[!@#$&*]/`,
    );
  });

  it('should fail when confirm_password is empty', () => {
    const validation = <Error>validate({
      user_id,
      password,
      confirm_password: '',
    });

    expect(validation.message).equal(
      '"confirm_password" must be [ref:password]',
    );
  });

  it('should fail when passwords mismatch', () => {
    const validation = <Error>validate({
      user_id,
      password,
      confirm_password: 'test',
    });

    expect(validation.message).equal(
      '"confirm_password" must be [ref:password]',
    );
  });

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      user_id,
      password,
      confirm_password: password,
      test: 'test',
    });

    expect(validation.message).equal('"test" is not allowed');
  });
});
