import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import FindMemosByUserIdSchema from '../../../../../src/infra/schemas/memo/FindMemosByUserIdSchema';

const { validate } = FindMemosByUserIdSchema;

describe('/infra/schemas/memo/FindMemosByUserIdSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({ user_id: faker.string.uuid() });

    expect(validation).equal(undefined);
  });

  it('should fail when user_id is empty', () => {
    const validation = <Error>validate({
      user_id: '',
    });

    expect(validation.message).equal('"user_id" is not allowed to be empty');
  });

  it('should fail when user_id is invalid', () => {
    const validation = <Error>validate({
      user_id: 'test',
    });

    expect(validation.message).equal('"user_id" must be a valid GUID');
  });

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      user_id: faker.string.uuid(),
      test: 'test',
    });

    expect(validation.message).equal('"test" is not allowed');
  });
});
