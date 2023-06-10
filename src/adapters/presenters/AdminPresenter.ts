import { LevelEnum, User } from '../../domain/User'
import Presenter from './Presenter'

export default class AdminPresenter implements Presenter {
  present(user: User) {
    const {
      user_id,
      email,
      level,
    } = user

    return {
      id: user_id,
      email,
      level: LevelEnum[level],
    }
  }
}
