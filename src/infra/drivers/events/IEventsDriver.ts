import IEvent from "../../../adapters/events/IEvent";

export default interface IEventsDriver {
  subscribe(topic: string, event: IEvent): void;
  publish(topic: string, data?: any): void;
}
