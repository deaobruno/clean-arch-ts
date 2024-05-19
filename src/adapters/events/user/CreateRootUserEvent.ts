import CreateRoot from '../../../application/useCases/user/CreateRoot';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import IEvent from '../IEvent';

type CreateRootUserEventInput = {
  email: string;
  password: string;
};

export default class CreateRootUserEvent implements IEvent {
  constructor(
    private logger: ILoggerDriver,
    private createRootUserUseCase: CreateRoot,
  ) {}

  trigger(data: CreateRootUserEventInput): void {
    try {
      this.createRootUserUseCase.exec(data);
      this.logger.debug({
        message: '[CreateRootUserEvent] Event triggered',
        data,
      });
    } catch (error) {
      this.logger.debug({
        message: '[CreateRootUserEvent] Event error',
        error,
      });
    }
  }
}
