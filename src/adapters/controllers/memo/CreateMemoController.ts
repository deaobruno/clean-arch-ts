import CreateMemo from "../../../application/useCases/memo/CreateMemo";
import CreateMemoSchema from "../../../infra/schemas/memo/CreateMemoSchema";
import AuthenticatedController from "../AuthenticatedController";
import ControllerConfig from "../ControllerConfig";
import MemoPresenter from "../../presenters/memo/MemoPresenter";

export default class CreateMemoController extends AuthenticatedController {
  statusCode = 201;

  constructor(
    config: ControllerConfig<CreateMemo, typeof CreateMemoSchema, MemoPresenter>
  ) {
    super(config);
  }
}
