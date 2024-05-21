import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import CustomerPresenter from '../../../../../src/adapters/presenters/user/CustomerPresenter';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

const loggerDriver = sinon.createStubInstance(PinoDriver);
const customerPresenter = new CustomerPresenter(loggerDriver);

describe('/application/presenters/user/CustomerPresenter.ts', () => {
  it('should return an external representation of a customer user object', () => {
    const userData = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    };
    const user = <User>User.create(userData);
    const customer = customerPresenter.toJson(user);

    expect(customer.id).equal(userData.userId);
    expect(customer.email).equal(userData.email);
  });
});
