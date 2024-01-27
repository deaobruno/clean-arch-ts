import BaseController from "../../../adapters/controllers/BaseController";

export default interface IServer {
  get(path: string, controller: BaseController): any;
  post(path: string, controller: BaseController): any;
  put(path: string, controller: BaseController): any;
  delete(path: string, controller: BaseController): any;
  start(httpPort: string | number, routes: any[]): void;
  stop(callback?: (error?: Error) => void): void;
}
