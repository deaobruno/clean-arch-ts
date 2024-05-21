import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import UserRole from '../../../../../src/domain/user/UserRole';
import User from '../../../../../src/domain/user/User';
import AdminPresenter from '../../../../../src/adapters/presenters/user/AdminPresenter';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';

const loggerDriver = sinon.createStubInstance(PinoDriver);
const adminPresenter = new AdminPresenter(loggerDriver);

describe('/application/presenters/user/AdminPresenter.ts', () => {
  it('should return an external representation of an admin user object', () => {
    const userData = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.ROOT,
    };
    const user = <User>User.create(userData);
    const admin = adminPresenter.toJson(user);

    expect(admin.id).equal(userData.userId);
    expect(admin.email).equal(userData.email);
    expect(admin.role).equal(UserRole[userData.role]);
  });
});
