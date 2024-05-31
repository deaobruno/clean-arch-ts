import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import CreateRoot from '../../../../../src/application/useCases/user/CreateRoot';
import CreateRootUserEvent from '../../../../../src/adapters/events/user/CreateRootUserEvent';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

describe('/src/adapters/events/user/CreateRootUserEvent.ts', () => {
  it('should trigger CreateRootUserEvent', () => {
    const loggerDriver = sinon.createStubInstance(PinoDriver);
    const createRootUserUseCase = sinon.createStubInstance(CreateRoot);
    const createRootUserEvent = new CreateRootUserEvent(
      loggerDriver,
      createRootUserUseCase,
    );
    const result = createRootUserEvent.trigger({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(result).equal(undefined);
  });

  it('should return void when event throws error', () => {
    const loggerDriver = sinon.createStubInstance(PinoDriver);
    const createRootUserUseCase = sinon.createStubInstance(CreateRoot);
    const createRootUserEvent = new CreateRootUserEvent(
      loggerDriver,
      createRootUserUseCase,
    );

    createRootUserUseCase.exec.throws(Error())

    const result = createRootUserEvent.trigger({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(result).equal(undefined);
  });
});
