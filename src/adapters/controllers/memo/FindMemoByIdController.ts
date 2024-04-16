import FindMemoById from '../../../application/useCases/memo/FindMemoById';
import FindMemoByIdSchema from '../../../infra/schemas/memo/FindMemoByIdSchema';
import AuthenticatedController from '../AuthenticatedController';
import ControllerConfig from '../ControllerConfig';
import MemoPresenter from '../../presenters/memo/MemoPresenter';

export default class FindMemoByIdController extends AuthenticatedController {
  statusCode = 200;

  constructor(
    config: ControllerConfig<
      FindMemoById,
      typeof FindMemoByIdSchema,
      MemoPresenter
    >,
  ) {
    super(config);
  }
}
