import { User } from '../../../domain/User'
import IPresenter from '../IPresenter'

export default class CustomerPresenter implements IPresenter {
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
