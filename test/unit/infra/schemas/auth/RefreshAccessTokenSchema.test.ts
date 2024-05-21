import { expect } from 'chai';
import RefreshAccessTokenSchema from '../../../../../src/infra/schemas/auth/RefreshAccessTokenSchema';

const { validate } = RefreshAccessTokenSchema;

describe('/infra/schemas/auth/RefreshAccessTokenSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      refresh_token: 'test',
    });

    expect(validation).equal(undefined);
  });

  it('should fail when refresh_token is empty', () => {
    const validation = <Error>validate({
      refresh_token: '',
    });

    expect(validation.message).equal(
      '"refresh_token" is not allowed to be empty',
    );
  });

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      refresh_token: 'test',
      test: 'test',
    });

    expect(validation.message).equal('"test" is not allowed');
  });
});
