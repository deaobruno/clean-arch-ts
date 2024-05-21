import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import CustomerPresenter from '../../../../../src/adapters/presenters/user/CustomerPresenter';

const customerPresenter = new CustomerPresenter();

describe('/application/presenters/user/CustomerPresenter.ts', () => {
  it('should return an external representation of a customer user object', () => {
    const userData = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.CUSTOMER,
    };
    const user = User.create(userData);
    const customer = customerPresenter.toJson(user);

    expect(customer.id).equal(userData.userId);
    expect(customer.email).equal(userData.email);
  });
});
