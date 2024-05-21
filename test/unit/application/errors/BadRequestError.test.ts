import { expect } from 'chai';
import BadRequestError from '../../../../src/application/errors/BadRequestError';

describe('/application/errors/BadRequestError.ts', () => {
  it('should throw a Bad Request Error', () => {
    expect(() => {
      throw new BadRequestError();
    }).throw('Bad Request');
  });
});
