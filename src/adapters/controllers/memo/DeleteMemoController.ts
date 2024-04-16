import DeleteMemo from '../../../application/useCases/memo/DeleteMemo';
import DeleteMemoSchema from '../../../infra/schemas/memo/DeleteMemoSchema';
import AuthenticatedController from '../AuthenticatedController';
import ControllerConfig from '../ControllerConfig';

export default class DeleteMemoController extends AuthenticatedController {
  statusCode = 204;

  constructor(config: ControllerConfig<DeleteMemo, typeof DeleteMemoSchema>) {
    super(config);
  }
}
