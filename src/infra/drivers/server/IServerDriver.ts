import BaseController from '../../../adapters/controllers/BaseController';

export default interface IServer {
  get(path: string, controller: BaseController): unknown;
  post(path: string, controller: BaseController): unknown;
  put(path: string, controller: BaseController): unknown;
  delete(path: string, controller: BaseController): unknown;
  start(httpPort: string | number): void;
  stop(callback?: (error?: Error) => void): void;
}
