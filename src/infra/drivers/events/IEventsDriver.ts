import IEvent from "../../../adapters/events/IEvent";

export default interface IEventsDriver {
  publish(topic: string, data?: any): void;
  subscribe(topic: string, event: IEvent): void;
}
