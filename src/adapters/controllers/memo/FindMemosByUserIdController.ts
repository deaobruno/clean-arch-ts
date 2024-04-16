import FindMemosByUserId from '../../../application/useCases/memo/FindMemosByUserId';
import FindMemosByUserIdSchema from '../../../infra/schemas/memo/FindMemosByUserIdSchema';
import AuthenticatedController from '../AuthenticatedController';
import ControllerConfig from '../ControllerConfig';
import MemoPresenter from '../../presenters/memo/MemoPresenter';

export default class FindMemosByUserIdController extends AuthenticatedController {
  statusCode = 200;

  constructor(
    config: ControllerConfig<
      FindMemosByUserId,
      typeof FindMemosByUserIdSchema,
      MemoPresenter
    >,
  ) {
    super(config);
  }
}
