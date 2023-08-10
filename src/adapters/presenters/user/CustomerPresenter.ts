import { User } from '../../../domain/User'
import IPresenter from '../IPresenter'

export default class CustomerPresenter implements IPresenter {
  present(user: User) {
    const {
      userId,
      email,
    } = user

    return {
      id: userId,
      email,
    }
  }
}
