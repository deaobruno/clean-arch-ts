import EventEmitter from 'node:events';
import IEvent from '../../../adapters/events/IEvent';
import IEventsDriver from './IEventsDriver';
import ILoggerDriver from '../logger/ILoggerDriver';

const eventEmitter = new EventEmitter();

export default class EventsDriver implements IEventsDriver {
  constructor(private logger: ILoggerDriver) {}

  subscribe(topic: string, event: IEvent): void {
    eventEmitter.on(topic, (data?: object) => {
      try {
        event.trigger(data);
      } catch (error) {
        this.logger.error(`[${topic}]: ${error}`);
      }
    });

    this.logger.debug({
      message: '[EventsDriver] Topic subscription',
      topic,
      event: event.constructor.name,
    });
  }

  publish(topic: string, data?: unknown): void {
    eventEmitter.emit(topic, data);

    this.logger.debug({
      message: '[EventsDriver] Event published',
      topic,
      data,
    });
  }
}
