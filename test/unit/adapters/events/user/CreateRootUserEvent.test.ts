import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import CreateRoot from '../../../../../src/application/useCases/user/CreateRoot';
import CreateRootUserEvent from '../../../../../src/adapters/events/user/CreateRootUserEvent';
import { expect } from 'chai';

describe('/src/adapters/events/user/CreateRootUserEvent.ts', () => {
  it('should trigger CreateRootUserEvent', () => {
    const createRootUserUseCase = sinon.createStubInstance(CreateRoot);
    const createRootUserEvent = new CreateRootUserEvent(createRootUserUseCase);
    const result = createRootUserEvent.trigger({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(result).equal(undefined);
  });
});
