import CreateRoot from "../../../application/useCases/user/CreateRoot";
import IEvent from "../IEvent";

type CreateRootUserEventInput = {
  email: string;
  password: string;
};

export default class CreateRootUserEvent implements IEvent {
  constructor(private createRootUserUseCase: CreateRoot) {}

  trigger(data: CreateRootUserEventInput): void {
    this.createRootUserUseCase.exec(data);
  }
}
