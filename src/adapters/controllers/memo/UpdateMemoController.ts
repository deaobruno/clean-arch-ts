import UpdateMemo from '../../../application/useCases/memo/UpdateMemo';
import UpdateMemoSchema from '../../../infra/schemas/memo/UpdateMemoSchema';
import AuthenticatedController from '../AuthenticatedController';
import ControllerConfig from '../ControllerConfig';
import MemoPresenter from '../../presenters/memo/MemoPresenter';

export default class UpdateMemoController extends AuthenticatedController {
  statusCode = 200;

  constructor(
    config: ControllerConfig<
      UpdateMemo,
      typeof UpdateMemoSchema,
      MemoPresenter
    >,
  ) {
    super(config);
  }
}
