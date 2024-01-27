import EventEmitter from "node:events";
import IEvent from "../../../adapters/events/IEvent";
import IEventsDriver from "./IEventsDriver";
import ILoggerDriver from "../logger/ILoggerDriver";

const eventEmitter = new EventEmitter();

export default class EventsDriver implements IEventsDriver {
  constructor(private _logger: ILoggerDriver) {}

  subscribe(topic: string, event: IEvent): void {
    eventEmitter.on(topic, (data?: any) => {
      try {
        event.trigger(data);
      } catch (error) {
        this._logger.error(`[${topic}]: ${error}`);
      }
    });
  }

  publish(topic: string, data?: any): void {
    eventEmitter.emit(topic, data);
  }
}
