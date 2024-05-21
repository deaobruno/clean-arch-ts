import sinon from 'sinon';
import EventsDriver from '../../../../../src/infra/drivers/events/EventsDriver';
import PinoDriver from '../../../../../src/infra/drivers/logger/PinoDriver';
import { expect } from 'chai';

const sandbox = sinon.createSandbox();
const loggerDriver = sandbox.createStubInstance(PinoDriver);
const eventsDriver = new EventsDriver(loggerDriver);
const topic = 'test';
const event = {
  trigger: (data: any) => {
    return data;
  },
};
const data = { test: 'ok' };
const triggerSpy = sandbox.spy(event, 'trigger');

describe('/src/infra/drivers/events/EventsDriver.ts', () => {
  it('should subscribe an event to a topic', () => {
    const result = eventsDriver.subscribe(topic, event);

    expect(result).equal(undefined);
  });

  it('should publish on topic', () => {
    const result = eventsDriver.publish(topic, data);

    expect(result).equal(undefined);
    expect(triggerSpy.calledWith(data)).equal(true);
  });

  it('should log error thrown by event', () => {
    triggerSpy.restore();

    const error = new Error('Error');
    const triggerStub = sandbox.stub(event, 'trigger').throws(error);
    const result = eventsDriver.publish(topic, data);

    expect(result).equal(undefined);
    expect(triggerStub.calledWith(data)).equal(true);
    expect(loggerDriver.error.calledWith(`[${topic}]: ${error}`)).equal(true);
  });
});
