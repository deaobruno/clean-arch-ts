import { User } from '../../domain/User';
import Presenter from './Presenter'

export default class CustomerPresenter implements Presenter {
  present(user: User) {
    return {
      id: user.id,
      email: user.email
    }
  }
}
