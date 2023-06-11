import { User } from '../../../domain/User'
import Presenter from '../Presenter'

export default class CustomerPresenter implements Presenter {
  present(user: User) {
    const {
      user_id,
      email,
    } = user

    return {
      id: user_id,
      email,
    }
  }
}
