import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UpdateUserPasswordSchema from '../../../../../src/infra/schemas/user/UpdateUserPasswordSchema';

const { validate } = UpdateUserPasswordSchema;
const user_id = faker.string.uuid();
const password = faker.internet.password();

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
