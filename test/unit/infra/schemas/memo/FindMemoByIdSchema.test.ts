import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import FindMemoByIdSchema from '../../../../../src/infra/schemas/memo/FindMemoByIdSchema';

const { validate } = FindMemoByIdSchema;

describe('/infra/schemas/memo/FindMemoByIdSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({ memo_id: faker.string.uuid() });

    expect(validation).equal(undefined);
  });

  it('should fail when memo_id is empty', () => {
    const validation = <Error>validate({
      memo_id: '',
    });

    expect(validation.message).equal('"memo_id" is not allowed to be empty');
  });

  it('should fail when memo_id is invalid', () => {
    const validation = <Error>validate({
      memo_id: 'test',
    });

    expect(validation.message).equal('"memo_id" must be a valid GUID');
  });

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      memo_id: faker.string.uuid(),
      test: 'test',
    });

    expect(validation.message).equal('"test" is not allowed');
  });
});
