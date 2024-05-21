import { expect } from 'chai';
import ConflictError from '../../../../src/application/errors/ConflictError';

describe('/application/errors/ConflictError.ts', () => {
  it('should throw a Conflict Error', () => {
    expect(() => {
      throw new ConflictError();
    }).throw('Conflict');
  });
});
