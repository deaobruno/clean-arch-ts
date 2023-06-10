import { User } from '../../domain/User'
import Presenter from './Presenter'

export default class CustomerPresenter implements Presenter {
  present(user: User) {
    const {
      id,
      email,
    } = user

    return {
      id,
      email,
    }
  }
}
