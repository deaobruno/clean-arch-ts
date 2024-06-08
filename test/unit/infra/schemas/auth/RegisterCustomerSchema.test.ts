import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import RegisterCustomerSchema from '../../../../../src/infra/schemas/auth/RegisterCustomerSchema';

const { validate } = RegisterCustomerSchema;
const password = `${faker.string.alpha({ length: 2, casing: 'lower' })}${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.string.numeric({ length: 2 })}${faker.string.fromCharacters('!@#$&*', 2)}`;

describe('/infra/schemas/auth/RegisterCustomerSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      email: faker.internet.email(),
      password,
      confirm_password: password,
    });

    expect(validation).equal(undefined);
  });

  it('should fail when email is empty', () => {
    const validation = <Error>validate({
      email: '',
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"email" is not allowed to be empty');
  });

  it('should fail when passing a number as email', () => {
    const validation = <Error>validate({
      email: 123,
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"email" must be a string');
  });

  it('should fail when passing a boolean as email', () => {
    const validation = <Error>validate({
      email: true,
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"email" must be a string');
  });

  it('should fail when passing an object as email', () => {
    const validation = <Error>validate({
      email: { test: 'test' },
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"email" must be a string');
  });

  it('should fail when passing a Bigint as email', () => {
    const validation = <Error>validate({
      email: BigInt(9007199254740991n),
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"email" must be a string');
  });

  it('should fail when passing invalid email', () => {
    const validation = <Error>validate({
      email: 'test',
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"email" must be a valid email');
  });

  it('should fail when email length is greater than 100', () => {
    const validation = <Error>validate({
      email: `${faker.string.alphanumeric(100)}@email.com`,
      password,
      confirm_password: password,
    });

    expect(validation.message).equal('"email" must be a valid email');
  });

  it('should fail when missing password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: '',
      confirm_password: password,
    });

    expect(validation.message).equal('"password" is not allowed to be empty');
  });

  it('should fail when password length is lower than 8', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: `${faker.string.alpha(7)}`,
      confirm_password: password,
    });

    expect(validation.message).equal(
      '"password" length must be at least 8 characters long',
    );
  });

  it('should fail when password length is greater than 64', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
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
      email: faker.internet.email(),
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
      email: faker.internet.email(),
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
      email: faker.internet.email(),
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
      email: faker.internet.email(),
      password: wrongPassword,
      confirm_password: password,
    });

    expect(validation.message).equal(
      `"password" with value "${wrongPassword}" fails to match the required pattern: /.*[!@#$&*]/`,
    );
  });

  it('should fail when missing confirm_password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password,
      confirm_password: '',
    });

    expect(validation.message).equal(
      '"confirm_password" must be [ref:password]',
    );
  });

  it('should fail when password and confirm_password are different', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password,
      confirm_password: '12345678',
    });

    expect(validation.message).equal(
      '"confirm_password" must be [ref:password]',
    );
  });

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password,
      confirm_password: password,
      test: 'test',
    });

    expect(validation.message).equal('"test" is not allowed');
  });
});
